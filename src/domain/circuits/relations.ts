import type { EvalCheck, Item } from "../../schemas/item.js";
import type { ChoicePrimitive } from "../../schemas/primitive.js";
import { buildNumericOptions, numericOptionChecks, type OptionSpec } from "../content/choice.js";
import { formatNumber, mulberry32, pick } from "../content/random.js";

const CURRENTS = [0.5, 1, 1.5, 2, 3, 4] as const;
const RESISTANCES = [2, 3, 4, 6, 8, 12] as const;

export function generateOhmItem(seed: number): Item {
  const rng = mulberry32(seed);
  const current = pick(rng, CURRENTS);
  const resistance = pick(rng, RESISTANCES);
  const voltage = current * resistance;
  const variant = pick(rng, ["current", "voltage", "resistance"] as const);

  let expected: number;
  let unit: string;
  let prompt: string;
  let distractors: OptionSpec[];
  let hint: string;
  let explanation: string;

  switch (variant) {
    case "current":
      expected = current;
      unit = "A";
      prompt = `A ${formatNumber(voltage)} V source is across a ${resistance} Ω resistor. What current flows?`;
      distractors = [
        { value: resistance / voltage, misconception: "That divides resistance by voltage." },
        { value: voltage * resistance, misconception: "That multiplies voltage and resistance." },
        { value: voltage + resistance, misconception: "That adds the quantities instead of dividing." },
      ];
      hint = "Use I = V / R.";
      explanation = `I = ${formatNumber(voltage)} V / ${resistance} Ω = ${formatNumber(current)} A.`;
      break;
    case "voltage":
      expected = voltage;
      unit = "V";
      prompt = `A ${formatNumber(current)} A current flows through ${resistance} Ω. What voltage is across the resistor?`;
      distractors = [
        { value: current / resistance, misconception: "That divides current by resistance." },
        { value: current + resistance, misconception: "That adds the quantities." },
        { value: resistance / current, misconception: "That inverts the relationship." },
      ];
      hint = "Use V = I R.";
      explanation = `V = ${formatNumber(current)} A × ${resistance} Ω = ${formatNumber(voltage)} V.`;
      break;
    case "resistance":
      expected = resistance;
      unit = "Ω";
      prompt = `A ${formatNumber(voltage)} V source drives ${formatNumber(current)} A. What resistance is in the circuit?`;
      distractors = [
        { value: current / voltage, misconception: "That divides current by voltage." },
        { value: voltage * current, misconception: "That multiplies voltage by current." },
        { value: voltage + current, misconception: "That adds the quantities." },
      ];
      hint = "Use R = V / I.";
      explanation = `R = ${formatNumber(voltage)} V / ${formatNumber(current)} A = ${resistance} Ω.`;
      break;
    default: {
      const exhaustive: never = variant;
      throw new Error(exhaustive);
    }
  }

  return choiceItem({
    seed,
    generatorId: "circuits.ohms-law",
    idPrefix: "ohms",
    prompt,
    unit,
    expected,
    distractors,
    hint,
    explanation,
    conceptIds: ["circuits.ohms-law"],
    difficultyD: 0.2,
    steps: [
      `Identify the knowns: V = ${formatNumber(voltage)} V, I = ${formatNumber(current)} A, R = ${resistance} Ω.`,
      `Rearrange V = I R for the requested quantity: ${variant}.`,
      `The result is ${formatNumber(expected)} ${unit}.`,
    ],
  });
}

export function generatePowerItem(seed: number): Item {
  const rng = mulberry32(seed);
  const current = pick(rng, [1, 2, 3, 4] as const);
  const resistance = pick(rng, [2, 4, 5, 6, 8] as const);
  const voltage = current * resistance;
  const variant = pick(rng, ["vi", "i2r", "v2r"] as const);

  const expected = variant === "vi" ? voltage * current : variant === "i2r" ? current ** 2 * resistance : voltage ** 2 / resistance;
  const prompt =
    variant === "vi"
      ? `A ${voltage} V source supplies ${current} A. What power is delivered?`
      : variant === "i2r"
        ? `A ${current} A current flows through ${resistance} Ω. What power is dissipated?`
        : `A ${voltage} V source is across ${resistance} Ω. What power is dissipated?`;

  const distractors: OptionSpec[] =
    variant === "vi"
      ? [
          { value: voltage / current, misconception: "That divides instead of multiplying." },
          { value: voltage + current, misconception: "That adds the quantities." },
          { value: voltage ** 2 / resistance, misconception: "That is a different power formula using resistance." },
        ]
      : variant === "i2r"
        ? [
            { value: current * resistance, misconception: "That is voltage, not power." },
            { value: current ** 2 / resistance, misconception: "That divides by resistance instead of multiplying." },
            { value: current + resistance, misconception: "That adds the quantities." },
          ]
        : [
            { value: voltage / resistance, misconception: "That is current, not power." },
            { value: voltage * resistance, misconception: "That multiplies voltage by resistance." },
            { value: voltage + resistance, misconception: "That adds the quantities." },
          ];

  return choiceItem({
    seed,
    generatorId: "circuits.power",
    idPrefix: "power",
    prompt,
    unit: "W",
    expected,
    distractors,
    hint:
      variant === "vi"
        ? "Use P = V I."
        : variant === "i2r"
          ? "Use P = I² R."
          : "Use P = V² / R.",
    explanation:
      variant === "vi"
        ? `P = ${voltage} × ${current} = ${formatNumber(expected)} W.`
        : variant === "i2r"
          ? `P = ${current}² × ${resistance} = ${formatNumber(expected)} W.`
          : `P = ${voltage}² / ${resistance} = ${formatNumber(expected)} W.`,
    conceptIds: ["circuits.power", "circuits.ohms-law"],
    difficultyD: 0.35,
    steps: [
      `Knowns: V = ${voltage} V, I = ${current} A, R = ${resistance} Ω.`,
      `Choose the power form that uses the given quantities: ${variant}.`,
      `P = ${formatNumber(expected)} W.`,
    ],
  });
}

interface ChoiceItemInput {
  seed: number;
  generatorId: string;
  idPrefix: string;
  prompt: string;
  unit: string;
  expected: number;
  distractors: OptionSpec[];
  hint: string;
  explanation: string;
  conceptIds: string[];
  difficultyD: number;
  steps: string[];
}

function choiceItem(input: ChoiceItemInput): Item {
  const rng = mulberry32(input.seed + 1000);
  const { primitiveOptions, answerId } = buildNumericOptions(rng, input.expected, input.distractors, input.unit);
  const checks: EvalCheck[] = [
    { name: "finite-values", passed: Number.isFinite(input.expected) && input.expected > 0 },
    ...numericOptionChecks(primitiveOptions, answerId, input.expected),
  ];
  const passed = checks.every((check) => check.passed);

  const primitive: ChoicePrimitive = {
    id: `${input.idPrefix}-${input.seed}`,
    kind: "choice",
    prompt: input.prompt,
    conceptIds: input.conceptIds,
    hint: input.hint,
    explanation: input.explanation,
    options: primitiveOptions,
    answer: answerId,
    misconceptionMap: Object.fromEntries(
      primitiveOptions
        .filter((option) => option.id !== answerId)
        .map((option) => [
          option.id,
          "Check which relationship connects the given quantities to the one requested.",
        ]),
    ),
  };

  return {
    id: primitive.id,
    generatorId: input.generatorId,
    generatorVersion: "1.0.0",
    seed: input.seed,
    primitive,
    solutionSteps: input.steps,
    difficultyD: input.difficultyD,
    evalReport: {
      passed,
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: passed ? "accepted" : "quarantined",
  };
}
