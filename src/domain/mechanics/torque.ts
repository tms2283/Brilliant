import type { EvalCheck, Item } from "../../schemas/item.js";
import type { ChoicePrimitive } from "../../schemas/primitive.js";
import { buildNumericOptions, numericOptionChecks, type OptionSpec } from "../content/choice.js";
import { formatNumber, mulberry32, pick } from "../content/random.js";

const LOAD_FORCES = [10, 12, 15, 20, 24, 30] as const;
const LOAD_DISTANCES = [1, 1.5, 2, 2.5, 3, 4] as const;
const EFFORT_FORCES = [4, 5, 6, 8, 10, 12] as const;

type TorqueVariant = "distance" | "effort" | "torque";

export function generateTorqueItem(seed: number): Item {
  const rng = mulberry32(seed);
  const loadForce = pick(rng, LOAD_FORCES);
  const loadDistance = pick(rng, LOAD_DISTANCES);
  const effortForce = pick(rng, EFFORT_FORCES);
  const variant = pick(rng, ["distance", "effort", "torque"] as const);

  const loadTorque = loadForce * loadDistance;
  const expected =
    variant === "distance" ? loadTorque / effortForce : variant === "effort" ? loadTorque / loadDistance : loadTorque;
  const unit = variant === "torque" ? "N m" : variant === "distance" ? "m" : "N";

  const prompt =
    variant === "distance"
      ? `A ${loadForce} N load sits ${loadDistance} m from a pivot. Where must a ${effortForce} N effort be placed to balance it?`
      : variant === "effort"
        ? `A ${loadForce} N load sits ${loadDistance} m from a pivot. What effort at ${loadDistance} m on the other side balances it?`
        : `A ${loadForce} N load sits ${loadDistance} m from a pivot. What torque does it produce about the pivot?`;

  const distractors: OptionSpec[] =
    variant === "distance"
      ? [
          { value: (loadDistance * effortForce) / loadForce, misconception: "That swaps the two forces." },
          { value: loadTorque, misconception: "That is the torque, not the distance." },
          { value: loadDistance / effortForce, misconception: "That divides distance by force without matching torques." },
        ]
      : variant === "effort"
        ? [
            { value: (loadDistance * loadForce) / loadForce, misconception: "That reuses the load force unchanged." },
            { value: loadTorque, misconception: "That is the torque, not the force." },
            { value: (loadForce * loadDistance) / (loadDistance * 2), misconception: "That halves the required effort." },
          ]
        : [
            { value: loadForce / loadDistance, misconception: "That divides force by distance." },
            { value: loadForce + loadDistance, misconception: "That adds force and distance." },
            { value: loadTorque / 2, misconception: "That uses half the lever arm." },
          ];

  const hint =
    variant === "torque"
      ? "Torque = force x perpendicular distance from the pivot."
      : "Balance the torques: load force x load distance = effort force x effort distance.";
  const explanation =
    variant === "distance"
      ? `${loadForce} N x ${loadDistance} m = ${formatNumber(loadTorque)} N m. Dividing by ${effortForce} N gives ${formatNumber(expected)} m.`
      : variant === "effort"
        ? `${loadForce} N x ${loadDistance} m = ${formatNumber(loadTorque)} N m. Dividing by ${loadDistance} m gives ${formatNumber(expected)} N.`
        : `${loadForce} N x ${loadDistance} m = ${formatNumber(expected)} N m.`;

  const rngOptions = mulberry32(seed + 2000);
  const { primitiveOptions, answerId } = buildNumericOptions(rngOptions, expected, distractors, unit);
  const checks: EvalCheck[] = [
    { name: "finite-values", passed: Number.isFinite(expected) && expected > 0 },
    { name: "load-torque-positive", passed: loadTorque > 0 },
    ...numericOptionChecks(primitiveOptions, answerId, expected),
  ];

  const primitive: ChoicePrimitive = {
    id: `torque-${seed}`,
    kind: "choice",
    prompt,
    conceptIds: ["mechanics.torque"],
    hint,
    explanation,
    options: primitiveOptions,
    answer: answerId,
    misconceptionMap: Object.fromEntries(
      primitiveOptions
        .filter((option) => option.id !== answerId)
        .map((option) => [
          option.id,
          "Compare the torque on each side before choosing. Force and distance trade off.",
        ]),
    ),
  };

  const passed = checks.every((check) => check.passed);

  return {
    id: primitive.id,
    generatorId: "mechanics.torque",
    generatorVersion: "1.0.0",
    seed,
    primitive,
    solutionSteps: [
      `Find the load torque: ${loadForce} N x ${loadDistance} m = ${formatNumber(loadTorque)} N m.`,
      variant === "torque"
        ? "Torque is already the requested quantity."
        : "Set the effort torque equal to the load torque, then solve for the missing quantity.",
      `The result is ${formatNumber(expected)} ${unit}.`,
    ],
    difficultyD: variant === "torque" ? 0.2 : 0.4,
    evalReport: {
      passed,
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: passed ? "accepted" : "quarantined",
  };
}
