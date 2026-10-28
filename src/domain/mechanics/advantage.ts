import type { EvalCheck, Item } from "../../schemas/item.js";
import type { ChoicePrimitive } from "../../schemas/primitive.js";
import { buildNumericOptions, numericOptionChecks, type OptionSpec } from "../content/choice.js";
import { formatNumber, mulberry32, pick } from "../content/random.js";

const EFFORT_DISTANCES = [2, 3, 4, 5, 6, 8, 10] as const;
const LOAD_DISTANCES = [0.5, 1, 1.5, 2] as const;
const LOAD_WEIGHTS = [60, 80, 100, 120, 150, 200, 240] as const;

type AdvantageVariant = "ima" | "effort" | "load" | "travel";

export function generateAdvantageItem(seed: number): Item {
  const rng = mulberry32(seed);
  const effortDist = pick(rng, EFFORT_DISTANCES);
  const loadDist = pick(rng, LOAD_DISTANCES);
  const ima = effortDist / loadDist;
  const loadWeight = pick(rng, LOAD_WEIGHTS);
  const effortForce = loadWeight / ima;
  const loadHeight = pick(rng, [0.2, 0.5, 1.0, 1.5] as const);

  const variant = pick(rng, ["ima", "effort", "load", "travel"] as const);

  let expected: number;
  let unit: string;
  let prompt: string;
  let distractors: OptionSpec[];
  let hint: string;
  let explanation: string;

  switch (variant) {
    case "ima":
      expected = ima;
      unit = "";
      prompt = `A lever has an effort arm of ${effortDist} m and a load arm of ${loadDist} m. What is its Ideal Mechanical Advantage (IMA)?`;
      distractors = [
        { value: loadDist / effortDist, misconception: "That divides load arm by effort arm instead of effort over load." },
        { value: effortDist * loadDist, misconception: "That multiplies the two distances instead of taking their ratio." },
        { value: effortDist - loadDist, misconception: "That subtracts the distances instead of finding their ratio." },
      ];
      hint = "Ideal Mechanical Advantage (IMA) = effort distance / load distance.";
      explanation = `IMA = ${effortDist} m / ${loadDist} m = ${formatNumber(ima)}. The lever multiplies input force by a factor of ${formatNumber(ima)}.`;
      break;

    case "effort":
      expected = effortForce;
      unit = "N";
      prompt = `A lever with an IMA of ${formatNumber(ima)} is used to lift a ${loadWeight} N weight. What effort force is required?`;
      distractors = [
        { value: loadWeight * ima, misconception: "That multiplies the load by IMA; mechanical advantage reduces the required effort." },
        { value: loadWeight / 2, misconception: "That assumes an IMA of 2 rather than using the given ratio." },
        { value: loadWeight - ima, misconception: "That subtracts the IMA from the load force." },
      ];
      hint = "Effort force = load force / IMA.";
      explanation = `Effort = ${loadWeight} N / ${formatNumber(ima)} = ${formatNumber(effortForce)} N.`;
      break;

    case "load":
      expected = loadWeight;
      unit = "N";
      prompt = `Using a lever with an IMA of ${formatNumber(ima)}, a worker applies ${formatNumber(effortForce)} N of effort. What maximum load can be balanced?`;
      distractors = [
        { value: effortForce / ima, misconception: "That divides the effort by IMA; a machine amplifies your effort force." },
        { value: effortForce * 2, misconception: "That assumes a fixed 2x multiplier rather than the lever's actual IMA." },
        { value: effortForce + ima, misconception: "That adds the IMA to the effort force." },
      ];
      hint = "Load lifted = effort force x IMA.";
      explanation = `Load = ${formatNumber(effortForce)} N x ${formatNumber(ima)} = ${formatNumber(loadWeight)} N.`;
      break;

    case "travel":
      expected = loadHeight * ima;
      unit = "m";
      prompt = `A lever has an IMA of ${formatNumber(ima)}. To lift a load by ${loadHeight} m, how far must the effort end move?`;
      distractors = [
        { value: loadHeight / ima, misconception: "Force is multiplied at the cost of distance; the effort must move farther, not less." },
        { value: loadHeight, misconception: "That assumes effort moves the same distance as the load." },
        { value: loadHeight + ima, misconception: "That adds the IMA to the lift height." },
      ];
      hint = "Work is conserved: effort distance = load height x IMA.";
      explanation = `Effort distance = ${loadHeight} m x ${formatNumber(ima)} = ${formatNumber(expected)} m. What is gained in force is paid in distance.`;
      break;
  }

  const rngOptions = mulberry32(seed + 3000);
  const { primitiveOptions, answerId } = buildNumericOptions(rngOptions, expected, distractors, unit);
  const checks: EvalCheck[] = [
    { name: "finite-values", passed: Number.isFinite(expected) && expected > 0 },
    { name: "ima-positive", passed: ima > 0 },
    ...numericOptionChecks(primitiveOptions, answerId, expected),
  ];

  const primitive: ChoicePrimitive = {
    id: `advantage-${seed}`,
    kind: "choice",
    prompt,
    conceptIds: ["mechanics.mechanical-advantage"],
    hint,
    explanation,
    options: primitiveOptions,
    answer: answerId,
    misconceptionMap: Object.fromEntries(
      primitiveOptions
        .filter((option) => option.id !== answerId)
        .map((option) => [
          option.id,
          "Consider whether the machine multiplies force or requires more travel distance.",
        ]),
    ),
  };

  const passed = checks.every((check) => check.passed);

  return {
    id: primitive.id,
    generatorId: "mechanics.mechanical-advantage",
    generatorVersion: "1.0.0",
    seed,
    primitive,
    solutionSteps: [
      `Identify the machine's ratio: IMA = effort arm / load arm = ${formatNumber(ima)}.`,
      variant === "ima"
        ? "The ratio itself is the answer."
        : variant === "effort"
          ? "Divide load force by IMA to find required effort."
          : variant === "load"
            ? "Multiply effort force by IMA to find supported load."
            : "Multiply load displacement by IMA because force multiplication requires proportional travel distance.",
      `The answer is ${formatNumber(expected)}${unit ? ` ${unit}` : ""}.`,
    ],
    difficultyD: variant === "ima" ? 0.25 : 0.35,
    evalReport: {
      passed,
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: passed ? "accepted" : "quarantined",
  };
}
