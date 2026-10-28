import type { EvalCheck, Item } from "../../schemas/item.js";
import type { ChoicePrimitive } from "../../schemas/primitive.js";
import { buildNumericOptions, numericOptionChecks, type OptionSpec } from "../content/choice.js";
import { formatNumber, mulberry32, pick } from "../content/random.js";

interface Medium {
  name: string;
  n: number;
}

const MEDIA: Medium[] = [
  { name: "Air", n: 1.0 },
  { name: "Water", n: 1.33 },
  { name: "Crown Glass", n: 1.52 },
  { name: "Flint Glass", n: 1.66 },
  { name: "Diamond", n: 2.42 },
];

const INCIDENT_ANGLES = [20, 30, 40, 45, 50, 60] as const;

type RefractionVariant = "angle" | "index" | "speed";

export function generateRefractionItem(seed: number): Item {
  const rng = mulberry32(seed);
  const m1 = pick(rng, MEDIA.slice(0, 2)); // Air or Water
  const m2 = pick(rng, MEDIA.slice(2)); // Glass or Diamond
  const theta1Deg = pick(rng, INCIDENT_ANGLES);
  const variant = pick(rng, ["angle", "index", "speed"] as const);

  const theta1Rad = (theta1Deg * Math.PI) / 180;
  const sinTheta2 = (m1.n / m2.n) * Math.sin(theta1Rad);
  const theta2Rad = Math.asin(sinTheta2);
  const theta2Deg = Number(((theta2Rad * 180) / Math.PI).toFixed(1));

  let expected: number;
  let unit: string;
  let prompt: string;
  let distractors: OptionSpec[];
  let hint: string;
  let explanation: string;

  switch (variant) {
    case "angle":
      expected = theta2Deg;
      unit = "°";
      prompt = `Light in ${m1.name} (n = ${m1.n.toFixed(2)}) enters ${m2.name} (n = ${m2.n.toFixed(2)}) at an angle of incidence of ${theta1Deg}°. What is the angle of refraction?`;
      distractors = [
        {
          value: Number(((theta1Deg * m1.n) / m2.n).toFixed(1)),
          misconception: "That divides the angle directly without using sines: Snell's law requires sin(θ), not θ.",
        },
        {
          value: Number(((Math.asin(Math.min(0.99, (m2.n / m1.n) * Math.sin(theta1Rad))) * 180) / Math.PI).toFixed(1)),
          misconception: "That inverts the index ratio, bending away from the normal instead of toward it.",
        },
        {
          value: theta1Deg,
          misconception: "Light only continues straight if the indices match.",
        },
      ];
      hint = "Snell's law: n1 sin(θ1) = n2 sin(θ2). Solve for θ2 = arcsin((n1 / n2) sin(θ1)).";
      explanation = `sin(θ2) = (${m1.n.toFixed(2)} / ${m2.n.toFixed(2)}) x sin(${theta1Deg}°) = ${sinTheta2.toFixed(3)}. Taking arcsin gives θ2 = ${theta2Deg}°.`;
      break;

    case "index":
      expected = m2.n;
      unit = "";
      prompt = `A beam of light traveling from ${m1.name} (n = ${m1.n.toFixed(2)}) at ${theta1Deg}° enters an unknown optical material at ${theta2Deg}°. What is the refractive index of the material?`;
      distractors = [
        {
          value: Number(((m1.n * Math.sin(theta2Rad)) / Math.sin(theta1Rad)).toFixed(2)),
          misconception: "That inverts the ratio of sines.",
        },
        {
          value: Number(((m1.n * theta1Deg) / theta2Deg).toFixed(2)),
          misconception: "That uses the ratio of raw angles instead of the ratio of sines.",
        },
        {
          value: Number((m1.n * 2).toFixed(2)),
          misconception: "That assumes the index simply doubles.",
        },
      ];
      hint = "Rearrange Snell's law: n2 = n1 sin(θ1) / sin(θ2).";
      explanation = `n2 = ${m1.n.toFixed(2)} x sin(${theta1Deg}°) / sin(${theta2Deg}°) = ${formatNumber(m2.n)}.`;
      break;

    case "speed": {
      const c = 3.0; // 10^8 m/s
      const speedInMedium = Number((c / m2.n).toFixed(2));
      expected = speedInMedium;
      unit = "x 10^8 m/s";
      prompt = `The refractive index of ${m2.name} is ${m2.n.toFixed(2)}. Given that light moves at 3.00 x 10^8 m/s in vacuum, what is its speed in ${m2.name}?`;
      distractors = [
        {
          value: Number((c * m2.n).toFixed(2)),
          misconception: "That multiplies by index of refraction instead of dividing; light slows down in denser media.",
        },
        {
          value: Number((c / 2).toFixed(2)),
          misconception: "That assumes an arbitrary 2x slowdown regardless of the material's index.",
        },
        {
          value: Number((c - (m2.n - 1)).toFixed(2)),
          misconception: "That subtracts the index difference rather than dividing by n.",
        },
      ];
      hint = "Index of refraction n = c / v, so v = c / n.";
      explanation = `v = (3.00 x 10^8 m/s) / ${m2.n.toFixed(2)} = ${speedInMedium} x 10^8 m/s.`;
      break;
    }
  }

  const rngOptions = mulberry32(seed + 4000);
  const { primitiveOptions, answerId } = buildNumericOptions(rngOptions, expected, distractors, unit);
  const checks: EvalCheck[] = [
    { name: "finite-values", passed: Number.isFinite(expected) && expected > 0 },
    { name: "theta2-valid", passed: theta2Deg > 0 && theta2Deg < 90 },
    ...numericOptionChecks(primitiveOptions, answerId, expected),
  ];

  const primitive: ChoicePrimitive = {
    id: `refraction-${seed}`,
    kind: "choice",
    prompt,
    conceptIds: ["optics.refraction"],
    hint,
    explanation,
    options: primitiveOptions,
    answer: answerId,
    misconceptionMap: Object.fromEntries(
      primitiveOptions
        .filter((option) => option.id !== answerId)
        .map((option) => [
          option.id,
          "Check Snell's law: n1 sin(θ1) = n2 sin(θ2). Light slows and bends toward the normal in denser media.",
        ]),
    ),
  };

  const passed = checks.every((check) => check.passed);

  return {
    id: primitive.id,
    generatorId: "optics.refraction",
    generatorVersion: "1.0.0",
    seed,
    primitive,
    solutionSteps: [
      `State the governing physical law: n1 sin(θ1) = n2 sin(θ2).`,
      variant === "angle"
        ? `Substitute knowns: ${m1.n.toFixed(2)} sin(${theta1Deg}°) = ${m2.n.toFixed(2)} sin(θ2).`
        : variant === "index"
          ? `Rearrange for n2: n2 = n1 sin(θ1) / sin(θ2).`
          : `Speed in medium is v = c / n.`,
      `The result is ${formatNumber(expected)}${unit ? ` ${unit}` : ""}.`,
    ],
    difficultyD: variant === "speed" ? 0.2 : 0.35,
    evalReport: {
      passed,
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: passed ? "accepted" : "quarantined",
  };
}
