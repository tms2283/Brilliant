import type { EvalCheck, Item } from "../../schemas/item.js";
import type { ChoicePrimitive } from "../../schemas/primitive.js";
import { assertConsistent, solveCircuit, type Circuit } from "./solver.js";
import { buildNumericOptions, numericOptionChecks, type OptionSpec } from "../content/choice.js";
import { formatNumber, mulberry32, pick, randInt } from "../content/random.js";

const RESISTORS = [2, 3, 4, 6, 8, 12] as const;
const VOLTAGES = [6, 9, 12, 24] as const;

function uniqueResistors(rng: () => number, count: number): number[] {
  const values = new Set<number>();
  while (values.size < count) values.add(pick(rng, RESISTORS));
  return [...values];
}

export function generateCircuitItem(seed: number): Item {
  const rng = mulberry32(seed);
  const mode = rng() < 0.5 ? "series" : "parallel";
  const sourceVoltage = pick(rng, VOLTAGES);
  const resistors = uniqueResistors(rng, randInt(rng, 2, 3));
  const circuit: Circuit = {
    mode,
    sourceVoltage,
    resistors: resistors.map((resistance, index) => ({ id: `r${index + 1}`, resistance })),
  };
  const solution = solveCircuit(circuit);
  assertConsistent(circuit, solution);

  const variants = mode === "series"
    ? (["total-current", "equivalent-resistance", "voltage-drop"] as const)
    : (["total-current", "equivalent-resistance", "branch-current"] as const);
  const variant = pick(rng, variants);
  const sum = resistors.reduce((total, value) => total + value, 0);
  const parallelEquivalent = 1 / resistors.reduce((total, value) => total + 1 / value, 0);
  const r1 = resistors[0]!;
  const r2 = resistors[1]!;

  let expected: number;
  let unit: string;
  let prompt: string;
  let distractors: OptionSpec[];

  switch (variant) {
    case "total-current":
      expected = solution.totalCurrent;
      unit = "A";
      prompt =
        mode === "series"
          ? `${resistors.join(" Î©, ")} Î© are in series across a ${sourceVoltage} V source. What current flows?`
          : `${resistors.join(" Î©, ")} Î© are in parallel across a ${sourceVoltage} V source. What total current does the source supply?`;
      distractors = [
        { value: sourceVoltage / r1, misconception: "That is the current if only the first resistor were present." },
        { value: sourceVoltage / r2, misconception: "That uses one branch instead of the equivalent resistance." },
        {
          value: mode === "series" ? sourceVoltage / parallelEquivalent : sourceVoltage / (sum),
          misconception:
            mode === "series"
              ? "That treats the resistors as parallel."
              : "That treats the resistors as series.",
        },
      ];
      break;
    case "equivalent-resistance":
      expected = solution.equivalentResistance;
      unit = "Î©";
      prompt =
        mode === "series"
          ? `What is the equivalent resistance of ${resistors.join(" Î©, ")} Î© in series?`
          : `What is the equivalent resistance of ${resistors.join(" Î©, ")} Î© in parallel?`;
      distractors = [
        {
          value: mode === "series" ? parallelEquivalent : sum,
          misconception: mode === "series" ? "That is the parallel combination." : "That is the series combination.",
        },
        { value: Math.min(...resistors), misconception: "The equivalent is never just the smallest branch." },
        { value: Math.max(...resistors), misconception: "The equivalent is not simply the largest branch." },
      ];
      break;
    case "voltage-drop":
      expected = solution.branches[0]!.voltageDrop;
      unit = "V";
      prompt = `A ${sourceVoltage} V source drives ${resistors.join(" Î©, ")} Î© in series. What is the voltage across the ${r1} Î© resistor?`;
      distractors = [
        { value: sourceVoltage, misconception: "The source voltage divides across series resistors." },
        { value: sourceVoltage / r1, misconception: "That is a current, not a voltage." },
        { value: solution.branches[0]!.power, misconception: "That is power, not voltage." },
      ];
      break;
    case "branch-current":
      expected = solution.branches[0]!.current;
      unit = "A";
      prompt = `A ${sourceVoltage} V source is connected across ${resistors.join(" Î©, ")} Î© in parallel. What current flows in the ${r1} Î© branch?`;
      distractors = [
        { value: solution.totalCurrent, misconception: "That is the total current, not one branch." },
        { value: sourceVoltage / solution.equivalentResistance, misconception: "That is the total current again." },
        { value: sourceVoltage / (r1 + r2), misconception: "That treats the branch resistors as series." },
      ];
      break;
    default: {
      const exhaustive: never = variant;
      throw new Error(exhaustive);
    }
  }

  const { primitiveOptions, answerId } = buildNumericOptions(rng, expected, distractors, unit);

  const checks: EvalCheck[] = [
    { name: "solver-consistent", passed: true },
    ...numericOptionChecks(primitiveOptions, answerId, expected),
  ];

  const primitive: ChoicePrimitive = {
    id: `circuits-${mode}-${seed}`,
    kind: "choice",
    prompt,
    conceptIds:
      mode === "series"
        ? ["circuits.series", "circuits.ohms-law"]
        : ["circuits.parallel", "circuits.ohms-law"],
    hint:
      mode === "series"
        ? "In series, add the resistances first, then use I = V / R."
        : "In parallel, each branch sees the full source voltage. Combine branch currents or use conductances.",
    explanation:
      mode === "series"
        ? `R_eq = ${formatNumber(solution.equivalentResistance)} Î©, so the source current is ${formatNumber(solution.totalCurrent)} A.`
        : `R_eq = ${formatNumber(solution.equivalentResistance)} Î© and the source supplies ${formatNumber(solution.totalCurrent)} A total.`,
    options: primitiveOptions,
    answer: answerId,
    misconceptionMap: Object.fromEntries(
      primitiveOptions
        .filter((option) => option.id !== answerId)
        .map((option) => [option.id, "Check which quantity the question asks for, then apply the series/parallel rule to the whole circuit."]),
    ),
  };

  return {
    id: `circuits-${mode}-${seed}`,
    generatorId: "circuits.series-parallel",
    generatorVersion: "1.0.0",
    seed,
    primitive,
    solutionSteps: [
      mode === "series"
        ? `Add the resistances: ${resistors.join(" + ")} = ${formatNumber(sum)} Î©.`
        : `Use 1/R_eq = ${resistors.map((value) => `1/${value}`).join(" + ")} to get R_eq = ${formatNumber(parallelEquivalent)} Î©.`,
      `The source current is V / R_eq = ${sourceVoltage} / ${formatNumber(solution.equivalentResistance)} = ${formatNumber(solution.totalCurrent)} A.`,
      `The requested quantity is ${formatNumber(expected)} ${unit}.`,
    ],
    difficultyD: mode === "series" ? 0.25 : 0.45,
    evalReport: {
      passed: checks.every((check) => check.passed),
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: checks.every((check) => check.passed) ? "accepted" : "quarantined",
  };
}

