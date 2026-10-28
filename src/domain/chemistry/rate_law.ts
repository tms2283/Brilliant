import type { EvalCheck, Item } from "../../schemas/item.js";
import type { ChoicePrimitive } from "../../schemas/primitive.js";
import { buildNumericOptions, numericOptionChecks, type OptionSpec } from "../content/choice.js";
import { formatNumber, mulberry32, pick } from "../content/random.js";

const BASE_CONCENTRATIONS = [0.1, 0.2, 0.25, 0.5] as const;
const BASE_RATES = [0.01, 0.02, 0.04, 0.05, 0.08] as const;
const ORDERS = [1, 2, 3] as const;

type RateLawVariant = "order" | "rate-constant" | "predicted-rate";

export function generateRateLawItem(seed: number): Item {
  const rng = mulberry32(seed);
  const order = pick(rng, ORDERS);
  const conc1 = pick(rng, BASE_CONCENTRATIONS);
  const factor = pick(rng, [2, 3] as const);
  const conc2 = Number((conc1 * factor).toFixed(2));
  const rate1 = pick(rng, BASE_RATES);
  const rateFactor = Math.pow(factor, order);
  const rate2 = Number((rate1 * rateFactor).toFixed(4));
  const k = Number((rate1 / Math.pow(conc1, order)).toFixed(3));

  const variant = pick(rng, ["order", "rate-constant", "predicted-rate"] as const);

  let expected: number;
  let unit: string;
  let prompt: string;
  let distractors: OptionSpec[];
  let hint: string;
  let explanation: string;

  switch (variant) {
    case "order":
      expected = order;
      unit = "";
      prompt = `In an experiment, increasing [A] from ${conc1} M to ${conc2} M (${factor}x) causes the initial reaction rate to change from ${rate1} M/s to ${rate2} M/s (${rateFactor}x). What is the order of the reaction with respect to A?`;
      distractors = [
        { value: order === 1 ? 2 : 1, misconception: "Check the ratio: rate factor = (concentration factor)^order." },
        { value: order === 3 ? 2 : 3, misconception: "Third order means rate scales with the cube of concentration." },
        { value: factor + 2, misconception: "That adds to the concentration factor instead of finding the exponent." },
      ];
      hint = "Compare the rate increase factor to the concentration increase factor: (rate2 / rate1) = (conc2 / conc1)^m.";
      explanation = `The concentration multiplied by ${factor}, and the rate multiplied by ${rateFactor}. Since ${factor}^${order} = ${rateFactor}, the reaction order is ${order}.`;
      break;

    case "rate-constant":
      expected = k;
      unit = order === 1 ? "s⁻¹" : order === 2 ? "M⁻¹ s⁻¹" : "M⁻² s⁻¹";
      prompt = `For a reaction Rate = k[A]${order > 1 ? `^${order}` : ""}, at [A] = ${conc1} M the measured rate is ${rate1} M/s. What is the value of the rate constant k?`;
      distractors = [
        {
          value: Number((rate1 * Math.pow(conc1, order)).toFixed(3)),
          misconception: "That multiplies rate by concentration instead of dividing: k = Rate / [A]^m.",
        },
        {
          value: Number((rate1 / conc1).toFixed(3)),
          misconception: "That assumes first order regardless of the actual reaction order.",
        },
        {
          value: Number((conc1 / rate1).toFixed(3)),
          misconception: "That divides concentration by rate rather than rate by concentration.",
        },
      ];
      hint = "Rearrange the rate law: k = Rate / [A]^m.";
      explanation = `k = ${rate1} / (${conc1}${order > 1 ? `^${order}` : ""}) = ${formatNumber(k)} ${unit}.`;
      break;

    case "predicted-rate": {
      const conc3 = Number((conc1 * (factor + 1)).toFixed(2));
      const predRate = Number((k * Math.pow(conc3, order)).toFixed(4));
      expected = predRate;
      unit = "M/s";
      prompt = `A reaction has rate law Rate = ${k} [A]${order > 1 ? `^${order}` : ""}. What is the expected initial rate when [A] = ${conc3} M?`;
      distractors = [
        {
          value: Number((k * conc3).toFixed(4)),
          misconception: "That ignores the reaction order exponent.",
        },
        {
          value: Number((rate1 * (factor + 1)).toFixed(4)),
          misconception: "That scales rate linearly with concentration regardless of order.",
        },
        {
          value: Number((rate1 / (factor + 1)).toFixed(4)),
          misconception: "Rate increases with concentration, not decreases.",
        },
      ];
      hint = "Substitute [A] into the rate law: Rate = k[A]^m.";
      explanation = `Rate = ${k} x (${conc3}${order > 1 ? `^${order}` : ""}) = ${formatNumber(predRate)} M/s.`;
      break;
    }
  }

  const rngOptions = mulberry32(seed + 6000);
  const { primitiveOptions, answerId } = buildNumericOptions(rngOptions, expected, distractors, unit);
  const checks: EvalCheck[] = [
    { name: "finite-values", passed: Number.isFinite(expected) && expected > 0 },
    { name: "order-in-range", passed: order >= 1 && order <= 3 },
    ...numericOptionChecks(primitiveOptions, answerId, expected),
  ];

  const primitive: ChoicePrimitive = {
    id: `rate-law-${seed}`,
    kind: "choice",
    prompt,
    conceptIds: ["chemistry.rate-laws"],
    hint,
    explanation,
    options: primitiveOptions,
    answer: answerId,
    misconceptionMap: Object.fromEntries(
      primitiveOptions
        .filter((option) => option.id !== answerId)
        .map((option) => [
          option.id,
          "Use the rate law Rate = k[A]^m. Order m tells you how sensitively rate responds to concentration.",
        ]),
    ),
  };

  const passed = checks.every((check) => check.passed);

  return {
    id: primitive.id,
    generatorId: "chemistry.rate-law",
    generatorVersion: "1.0.0",
    seed,
    primitive,
    solutionSteps: [
      "Recall the general rate equation: Rate = k [A]^m.",
      variant === "order"
        ? `Find the ratio (rate2 / rate1) = ${rateFactor} and (conc2 / conc1) = ${factor}. Solve ${factor}^m = ${rateFactor} => m = ${order}.`
        : variant === "rate-constant"
          ? `Solve for k = Rate / [A]^${order} = ${rate1} / ${Math.pow(conc1, order)} = ${k}.`
          : `Substitute k = ${k} and [A] = ${conc1 * (factor + 1)} into the rate law.`,
      `The result is ${formatNumber(expected)}${unit ? ` ${unit}` : ""}.`,
    ],
    difficultyD: variant === "order" ? 0.25 : 0.35,
    evalReport: {
      passed,
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: passed ? "accepted" : "quarantined",
  };
}
