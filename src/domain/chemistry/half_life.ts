import type { EvalCheck, Item } from "../../schemas/item.js";
import type { ChoicePrimitive } from "../../schemas/primitive.js";
import { buildNumericOptions, numericOptionChecks, type OptionSpec } from "../content/choice.js";
import { formatNumber, mulberry32, pick } from "../content/random.js";

const HALF_LIVES = [10, 15, 20, 25, 30, 40, 50, 60] as const; // minutes
const INITIAL_AMOUNTS = [40, 64, 80, 100, 120, 160] as const; // mg
const HALF_LIFE_STEPS = [1, 2, 3, 4] as const;

type HalfLifeVariant = "remaining-amount" | "elapsed-time" | "half-life-from-k";

export function generateHalfLifeItem(seed: number): Item {
  const rng = mulberry32(seed);
  const tHalf = pick(rng, HALF_LIVES);
  const n = pick(rng, HALF_LIFE_STEPS);
  const a0 = pick(rng, INITIAL_AMOUNTS);
  const elapsed = tHalf * n;
  const remaining = Number((a0 * Math.pow(0.5, n)).toFixed(2));

  // Rate constant k for 1st order: k = ln(2) / t_half = 0.693 / t_half
  const kVal = Number((0.693 / tHalf).toFixed(4));

  const variant = pick(rng, ["remaining-amount", "elapsed-time", "half-life-from-k"] as const);

  let expected: number;
  let unit: string;
  let prompt: string;
  let distractors: OptionSpec[];
  let hint: string;
  let explanation: string;

  switch (variant) {
    case "remaining-amount":
      expected = remaining;
      unit = "mg";
      prompt = `A sample of reactant decomposes via first-order kinetics with a half-life of ${tHalf} minutes. If the initial mass is ${a0} mg, how much remains after ${elapsed} minutes?`;
      distractors = [
        {
          value: Number((a0 - a0 * (elapsed / (tHalf * 5))).toFixed(2)),
          misconception: "That assumes linear decay over time rather than exponential half-lives.",
        },
        {
          value: a0 / 2,
          misconception: "That only applies after one half-life, not after the full elapsed time.",
        },
        {
          value: Number((remaining / 2).toFixed(2)),
          misconception: "That counts one too many half-lives.",
        },
      ];
      hint = `Count the number of half-lives: n = ${elapsed} min / ${tHalf} min. Each half-life halves the remaining amount: [A] = [A]0 x (1/2)^n.`;
      explanation = `${elapsed} min is ${n} half-lives (${elapsed} / ${tHalf} = ${n}). Halving ${a0} mg ${n} times gives ${a0} -> ${remaining} mg.`;
      break;

    case "elapsed-time":
      expected = elapsed;
      unit = "min";
      prompt = `A first-order reactant has a half-life of ${tHalf} minutes. How many minutes will it take for an initial ${a0} mg sample to decay down to ${remaining} mg?`;
      distractors = [
        {
          value: tHalf,
          misconception: "That is only one half-life; check how many times the sample halved.",
        },
        {
          value: tHalf * (n + 1),
          misconception: "That counts one extra half-life.",
        },
        {
          value: Number(((a0 - remaining) / 2).toFixed(1)),
          misconception: "That confuses mass lost with elapsed time.",
        },
      ];
      hint = `Find how many times ${a0} mg must be halved to reach ${remaining} mg. Then multiply by the half-life.`;
      explanation = `${a0} mg halves ${n} times to reach ${remaining} mg (${a0} x (1/2)^${n} = ${remaining}). Time = ${n} x ${tHalf} min = ${elapsed} min.`;
      break;

    case "half-life-from-k":
      expected = tHalf;
      unit = "min";
      prompt = `A first-order reaction has a rate constant k = ${kVal} min⁻¹. What is the half-life (t₁/₂) of this reaction? (Use ln(2) ≈ 0.693)`;
      distractors = [
        {
          value: Number((1 / kVal).toFixed(1)),
          misconception: "That is the mean lifetime (1/k), not the half-life: t₁/₂ = 0.693 / k.",
        },
        {
          value: Number((kVal * 60).toFixed(1)),
          misconception: "That converts units incorrectly instead of dividing 0.693 by k.",
        },
        {
          value: Number((0.693 * kVal).toFixed(2)),
          misconception: "That multiplies 0.693 by k instead of dividing by k.",
        },
      ];
      hint = "For first-order reactions: t₁/₂ = ln(2) / k ≈ 0.693 / k.";
      explanation = `t₁/₂ = 0.693 / ${kVal} min⁻¹ = ${tHalf} min. In first-order kinetics, half-life is completely independent of initial concentration.`;
      break;
  }

  const rngOptions = mulberry32(seed + 7000);
  const { primitiveOptions, answerId } = buildNumericOptions(rngOptions, expected, distractors, unit);
  const checks: EvalCheck[] = [
    { name: "finite-values", passed: Number.isFinite(expected) && expected > 0 },
    { name: "half-life-positive", passed: tHalf > 0 },
    ...numericOptionChecks(primitiveOptions, answerId, expected),
  ];

  const primitive: ChoicePrimitive = {
    id: `half-life-${seed}`,
    kind: "choice",
    prompt,
    conceptIds: ["chemistry.half-life"],
    hint,
    explanation,
    options: primitiveOptions,
    answer: answerId,
    misconceptionMap: Object.fromEntries(
      primitiveOptions
        .filter((option) => option.id !== answerId)
        .map((option) => [
          option.id,
          "Recall that first-order decay halves the remaining quantity every t₁/₂ interval: [A] = [A]0 (1/2)^n.",
        ]),
    ),
  };

  const passed = checks.every((check) => check.passed);

  return {
    id: primitive.id,
    generatorId: "chemistry.half-life",
    generatorVersion: "1.0.0",
    seed,
    primitive,
    solutionSteps: [
      "Identify the first-order kinetic model: half-life is constant regardless of concentration.",
      variant === "remaining-amount"
        ? `Compute number of half-lives: n = ${elapsed} / ${tHalf} = ${n}. Amount remaining = ${a0} x (1/2)^${n} = ${remaining} mg.`
        : variant === "elapsed-time"
          ? `Determine that ${a0} mg decays to ${remaining} mg in ${n} half-lives. Total time = ${n} x ${tHalf} = ${elapsed} min.`
          : `Use t₁/₂ = 0.693 / k = 0.693 / ${kVal} = ${tHalf} min.`,
      `The result is ${formatNumber(expected)}${unit ? ` ${unit}` : ""}.`,
    ],
    difficultyD: variant === "half-life-from-k" ? 0.25 : 0.35,
    evalReport: {
      passed,
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: passed ? "accepted" : "quarantined",
  };
}
