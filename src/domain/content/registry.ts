import type { Domain } from "../../schemas/common.js";
import type { Item } from "../../schemas/item.js";
import { ItemSchema } from "../../schemas/item.js";
import { generateCircuitItem } from "../circuits/generator.js";
import { generateOhmItem, generatePowerItem } from "../circuits/relations.js";
import { generateBalanceOneStep, generateBalanceTwoStep } from "../balance/generator.js";
import { generateTorqueItem } from "../mechanics/torque.js";
import { generateAdvantageItem } from "../mechanics/advantage.js";
import { generateRefractionItem } from "../optics/refraction.js";
import { generateLensItem } from "../optics/lens.js";
import { generateRateLawItem } from "../chemistry/rate_law.js";
import { generateHalfLifeItem } from "../chemistry/half_life.js";
import { generateLogicItem } from "../logic/generator.js";

export interface GeneratorDefinition {
  id: string;
  version: string;
  domain: Domain;
  generate: (seed: number) => Item;
}

const DEFINITIONS: GeneratorDefinition[] = [
  {
    id: "circuits.series-parallel",
    version: "1.0.0",
    domain: "circuits",
    generate: generateCircuitItem,
  },
  {
    id: "circuits.ohms-law",
    version: "1.0.0",
    domain: "circuits",
    generate: generateOhmItem,
  },
  {
    id: "circuits.power",
    version: "1.0.0",
    domain: "circuits",
    generate: generatePowerItem,
  },
  {
    id: "balance.linear-one-step",
    version: "1.0.0",
    domain: "balance",
    generate: generateBalanceOneStep,
  },
  {
    id: "balance.linear-two-step",
    version: "1.0.0",
    domain: "balance",
    generate: generateBalanceTwoStep,
  },
  {
    id: "mechanics.torque",
    version: "1.0.0",
    domain: "mechanics",
    generate: generateTorqueItem,
  },
  {
    id: "mechanics.mechanical-advantage",
    version: "1.0.0",
    domain: "mechanics",
    generate: generateAdvantageItem,
  },
  {
    id: "optics.refraction",
    version: "1.0.0",
    domain: "optics",
    generate: generateRefractionItem,
  },
  {
    id: "optics.thin-lens",
    version: "1.0.0",
    domain: "optics",
    generate: generateLensItem,
  },
  {
    id: "chemistry.rate-law",
    version: "1.0.0",
    domain: "chemistry",
    generate: generateRateLawItem,
  },
  {
    id: "chemistry.half-life",
    version: "1.0.0",
    domain: "chemistry",
    generate: generateHalfLifeItem,
  },
  {
    id: "logic.gates",
    version: "1.0.0",
    domain: "logic",
    generate: generateLogicItem,
  },
];

const REGISTRY = new Map(DEFINITIONS.map((definition) => [definition.id, definition]));

export function getGenerator(id: string): GeneratorDefinition | null {
  return REGISTRY.get(id) ?? null;
}

export function listGenerators(): GeneratorDefinition[] {
  return [...DEFINITIONS];
}

export interface GeneratedPractice {
  generatorId: string;
  generatorVersion: string;
  items: Item[];
}

export function generatePractice(
  generatorId: string,
  count: number,
  startSeed = 1,
): GeneratedPractice {
  const generator = getGenerator(generatorId);
  if (!generator) throw new Error(`Unknown generator: ${generatorId}`);
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("Practice count must be an integer between 1 and 50");
  }

  const items: Item[] = [];
  for (let index = 0; index < count; index += 1) {
    const seed = startSeed + index;
    const item = ItemSchema.parse(generator.generate(seed));
    if (!item.evalReport.passed || item.status !== "accepted") {
      throw new Error(
        `Generator ${generatorId} produced a failing item at seed ${seed}: ${item.evalReport.checks
          .filter((check) => !check.passed)
          .map((check) => check.name)
          .join(", ")}`,
      );
    }
    items.push(item);
  }

  return { generatorId, generatorVersion: generator.version, items };
}

export function verifyGenerator(generatorId: string, sampleSize = 100): { seed: number; failed: string[] }[] {
  const generator = getGenerator(generatorId);
  if (!generator) throw new Error(`Unknown generator: ${generatorId}`);
  const failures: { seed: number; failed: string[] }[] = [];
  for (let seed = 1; seed <= sampleSize; seed += 1) {
    const item = ItemSchema.parse(generator.generate(seed));
    const failed = item.evalReport.checks.filter((check) => !check.passed).map((check) => check.name);
    if (!item.evalReport.passed || item.status !== "accepted") failures.push({ seed, failed });
  }
  return failures;
}
