import type { EvalCheck, Item } from "../../schemas/item.js";
import type { ChoicePrimitive } from "../../schemas/primitive.js";
import { buildNumericOptions, numericOptionChecks, type OptionSpec } from "../content/choice.js";
import { formatNumber, mulberry32, pick } from "../content/random.js";

interface LensScenario {
  f: number;
  do: number;
  di: number;
}

const SCENARIOS: LensScenario[] = [
  { f: 10, do: 15, di: 30 },
  { f: 10, do: 20, di: 20 },
  { f: 10, do: 30, di: 15 },
  { f: 12, do: 24, di: 24 },
  { f: 15, do: 20, di: 60 },
  { f: 20, do: 30, di: 60 },
  { f: 20, do: 60, di: 30 },
];

type LensVariant = "image-distance" | "focal-length" | "image-height";

export function generateLensItem(seed: number): Item {
  const rng = mulberry32(seed);
  const scenario = pick(rng, SCENARIOS);
  const variant = pick(rng, ["image-distance", "focal-length", "image-height"] as const);
  const objHeight = pick(rng, [2, 4, 5, 6, 8] as const);

  let expected: number;
  let unit: string;
  let prompt: string;
  let distractors: OptionSpec[];
  let hint: string;
  let explanation: string;

  const mag = scenario.di / scenario.do;
  const imgHeight = objHeight * mag;

  switch (variant) {
    case "image-distance":
      expected = scenario.di;
      unit = "cm";
      prompt = `An object is placed ${scenario.do} cm in front of a converging lens with a focal length of ${scenario.f} cm. How far from the lens does the real image form?`;
      distractors = [
        {
          value: scenario.do - scenario.f,
          misconception: "That subtracts focal length directly: 1/f = 1/do + 1/di uses reciprocal addition, not simple subtraction.",
        },
        {
          value: scenario.do + scenario.f,
          misconception: "That adds focal length and object distance directly.",
        },
        {
          value: scenario.f * 2,
          misconception: "That assumes the image always forms at 2f.",
        },
      ];
      hint = "Thin lens equation: 1/di = 1/f - 1/do.";
      explanation = `1/di = 1/${scenario.f} - 1/${scenario.do} = (${scenario.do} - ${scenario.f}) / (${scenario.f} x ${scenario.do}). Inverting gives di = ${scenario.di} cm.`;
      break;

    case "focal-length":
      expected = scenario.f;
      unit = "cm";
      prompt = `An object at ${scenario.do} cm produces a focused image on a screen ${scenario.di} cm on the other side of a thin lens. What is the lens's focal length?`;
      distractors = [
        {
          value: (scenario.do + scenario.di) / 2,
          misconception: "That computes the arithmetic average of object and image distance.",
        },
        {
          value: scenario.di - scenario.do,
          misconception: "That subtracts the two distances.",
        },
        {
          value: Number(((scenario.do * scenario.di) / (scenario.di - scenario.do)).toFixed(1)),
          misconception: "That subtracts the denominators instead of adding: 1/f = 1/do + 1/di means f = do di / (do + di).",
        },
      ];
      hint = "Thin lens equation: 1/f = 1/do + 1/di, so f = (do x di) / (do + di).";
      explanation = `f = (${scenario.do} x ${scenario.di}) / (${scenario.do} + ${scenario.di}) = ${scenario.f} cm.`;
      break;

    case "image-height":
      expected = imgHeight;
      unit = "cm";
      prompt = `A ${objHeight} cm tall object is placed ${scenario.do} cm from a lens, forming an image at ${scenario.di} cm. What is the height of the image?`;
      distractors = [
        {
          value: objHeight / mag,
          misconception: "That divides by magnification instead of multiplying: image height = object height x (di / do).",
        },
        {
          value: objHeight,
          misconception: "That assumes the image is the same size as the object.",
        },
        {
          value: objHeight + (scenario.di - scenario.do),
          misconception: "That adds the distance difference to the height.",
        },
      ];
      hint = "Magnification |M| = di / do. Image height = object height x |M|.";
      explanation = `Magnification = ${scenario.di} cm / ${scenario.do} cm = ${formatNumber(mag)}. Image height = ${objHeight} cm x ${formatNumber(mag)} = ${formatNumber(imgHeight)} cm.`;
      break;
  }

  const rngOptions = mulberry32(seed + 5000);
  const { primitiveOptions, answerId } = buildNumericOptions(rngOptions, expected, distractors, unit);
  const checks: EvalCheck[] = [
    { name: "finite-values", passed: Number.isFinite(expected) && expected > 0 },
    { name: "lens-equation-consistent", passed: Math.abs(1 / scenario.f - (1 / scenario.do + 1 / scenario.di)) < 1e-4 },
    ...numericOptionChecks(primitiveOptions, answerId, expected),
  ];

  const primitive: ChoicePrimitive = {
    id: `lens-${seed}`,
    kind: "choice",
    prompt,
    conceptIds: ["optics.thin-lens"],
    hint,
    explanation,
    options: primitiveOptions,
    answer: answerId,
    misconceptionMap: Object.fromEntries(
      primitiveOptions
        .filter((option) => option.id !== answerId)
        .map((option) => [
          option.id,
          "Use the thin lens equation: 1/f = 1/do + 1/di and magnification |M| = di / do.",
        ]),
    ),
  };

  const passed = checks.every((check) => check.passed);

  return {
    id: primitive.id,
    generatorId: "optics.thin-lens",
    generatorVersion: "1.0.0",
    seed,
    primitive,
    solutionSteps: [
      "Write the thin lens formula: 1/f = 1/do + 1/di.",
      variant === "image-distance"
        ? `Isolate 1/di = 1/${scenario.f} - 1/${scenario.do}, then invert.`
        : variant === "focal-length"
          ? `Calculate 1/f = 1/${scenario.do} + 1/${scenario.di}, then invert.`
          : `Calculate magnification M = di / do = ${formatNumber(mag)}, then multiply by object height.`,
      `The answer is ${formatNumber(expected)}${unit ? ` ${unit}` : ""}.`,
    ],
    difficultyD: variant === "image-height" ? 0.35 : 0.3,
    evalReport: {
      passed,
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: passed ? "accepted" : "quarantined",
  };
}
