import type { EvalCheck } from "../../schemas/item.js";
import { formatNumber, roundTo, shuffle } from "./random.js";

export interface OptionSpec {
  value: number;
  misconception?: string;
}

export interface NumericOptions {
  primitiveOptions: { id: string; label: string }[];
  answerId: string;
  values: Map<string, number>;
}

export function buildNumericOptions(
  rng: () => number,
  expected: number,
  distractors: OptionSpec[],
  unit: string,
): NumericOptions {
  const correct = roundTo(expected);
  const specs: OptionSpec[] = [{ value: correct }];
  for (const distractor of distractors) {
    const value = roundTo(distractor.value);
    if (value > 0 && Number.isFinite(value) && !specs.some((entry) => entry.value === value)) {
      specs.push({ ...distractor, value });
    }
  }
  let factor = 1.5;
  let fallback = 1;
  while (specs.length < 4) {
    const value = correct > 0 ? roundTo(correct * factor) : fallback;
    if (value > 0 && !specs.some((entry) => entry.value === value)) {
      specs.push({ value, misconception: "This uses a plausible but incorrect relationship." });
    }
    factor += 0.5;
    fallback += 1;
  }

  const ordered = shuffle(rng, specs).slice(0, 4);
  const ids = ["a", "b", "c", "d"];
  const values = new Map<string, number>();
  const primitiveOptions = ordered.map((spec, index) => {
    const id = ids[index]!;
    values.set(id, spec.value);
    return { id, label: `${formatNumber(spec.value)} ${unit}` };
  });
  const answerIndex = ordered.findIndex((spec) => spec.value === correct);
  if (answerIndex < 0) throw new Error("Generator lost the correct option");

  return {
    primitiveOptions,
    answerId: ids[answerIndex]!,
    values,
  };
}

export function numericOptionChecks(
  options: { id: string; label: string }[],
  answerId: string,
  expected: number,
): EvalCheck[] {
  return [
    {
      name: "answer-matches-independent-solution",
      passed:
        Number.parseFloat(options.find((option) => option.id === answerId)?.label ?? "") === roundTo(expected),
      detail: `${options.find((option) => option.id === answerId)?.label} vs ${formatNumber(expected)}`,
    },
    {
      name: "unique-options",
      passed: new Set(options.map((option) => option.label)).size === options.length,
    },
    {
      name: "answer-present",
      passed: options.some((option) => option.id === answerId),
    },
    {
      name: "plausible-values",
      passed: options.every((option) => {
        const value = Number.parseFloat(option.label);
        return Number.isFinite(value) && value > 0;
      }),
    },
  ];
}
