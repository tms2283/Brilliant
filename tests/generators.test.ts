import { describe, expect, it } from "vitest";
import { generatePractice, listGenerators, verifyGenerator } from "../src/domain/content/registry.js";
import { evaluatePrimitive } from "../src/domain/evaluate.js";
import { ItemSchema } from "../src/schemas/item.js";

describe("generators", () => {
  it("registers generators across all science and math domains", () => {
    expect(listGenerators().map((generator) => generator.id)).toEqual([
      "circuits.series-parallel",
      "circuits.ohms-law",
      "circuits.power",
      "balance.linear-one-step",
      "balance.linear-two-step",
      "mechanics.torque",
      "mechanics.mechanical-advantage",
      "optics.refraction",
      "optics.thin-lens",
      "chemistry.rate-law",
      "chemistry.half-life",
      "logic.gates",
    ]);
  });

  for (const generator of listGenerators()) {
    it(`produces 100 evaluated items for ${generator.id}`, () => {
      expect(verifyGenerator(generator.id, 100)).toEqual([]);
    });
  }

  it("is deterministic by seed", () => {
    const first = generatePractice("circuits.series-parallel", 5, 42);
    const second = generatePractice("circuits.series-parallel", 5, 42);
    expect(first.items.map((item) => item.primitive)).toEqual(second.items.map((item) => item.primitive));
  });

  it("accepts its own answer for every generated item", () => {
    for (const generator of listGenerators()) {
      const practice = generatePractice(generator.id, 25, 7);
      for (const item of practice.items) {
        const parsed = ItemSchema.parse(item);
        const response = parsed.primitive.answer;
        expect(evaluatePrimitive(parsed.primitive, response).correct).toBe(true);
      }
    }
  });

  it("rejects unknown generators and invalid counts", () => {
    expect(() => generatePractice("nope", 3)).toThrow(/Unknown generator/);
    expect(() => generatePractice("circuits.series-parallel", 0)).toThrow(/between 1 and 50/);
    expect(() => generatePractice("circuits.series-parallel", 51)).toThrow(/between 1 and 50/);
  });
});
