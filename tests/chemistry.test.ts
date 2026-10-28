import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/content/index.js";
import { verifyGenerator } from "../src/domain/content/registry.js";
import { evaluatePrimitive } from "../src/domain/evaluate.js";
import { KineticsPrimitiveSchema } from "../src/schemas/primitive.js";

const kineticsItem = KineticsPrimitiveSchema.parse({
  id: "test-kinetics",
  kind: "kinetics",
  prompt: "Adjust concentration to match target rate.",
  conceptIds: ["chemistry.rate-laws"],
  hint: "Rate = k[A]^1.",
  explanation: "1.00 M/s = 0.50 x 2.00 M.",
  reactant: "A",
  order: 1,
  k: 0.5,
  minConcM: 0.2,
  maxConcM: 3.0,
  stepConcM: 0.1,
  targetRateMPerS: 1.0,
  answer: 2.0,
  tolerance: 0.08,
});

describe("chemistry kinetics", () => {
  it("accepts a concentration within tolerance", () => {
    expect(evaluatePrimitive(kineticsItem, 2.0).correct).toBe(true);
    expect(evaluatePrimitive(kineticsItem, 2.05).correct).toBe(true);
    expect(evaluatePrimitive(kineticsItem, 1.95).correct).toBe(true);
    expect(evaluatePrimitive(kineticsItem, 1.8).correct).toBe(false);
    expect(evaluatePrimitive(kineticsItem, 2.3).correct).toBe(false);
  });

  it("generates evaluated rate law items across 100 seeds", () => {
    expect(verifyGenerator("chemistry.rate-law", 100)).toEqual([]);
  });

  it("generates evaluated half-life items across 100 seeds", () => {
    expect(verifyGenerator("chemistry.half-life", 100)).toEqual([]);
  });

  it("ships chemistry-01 with kinetics manipulative, checks, and practice", () => {
    const lesson = LESSONS.find((entry) => entry.id === "chemistry-01");
    expect(lesson).toBeDefined();
    expect(lesson!.learn.map((primitive) => primitive.kind)).toEqual(["kinetics", "choice"]);
    expect(lesson!.check.map((primitive) => primitive.kind)).toEqual(["kinetics", "choice"]);
    expect(lesson!.practice?.generatorId).toBe("chemistry.rate-law");
  });

  it("ships chemistry-02 with first-order half-life checks and practice", () => {
    const lesson = LESSONS.find((entry) => entry.id === "chemistry-02");
    expect(lesson).toBeDefined();
    expect(lesson!.learn.map((primitive) => primitive.kind)).toEqual(["choice", "slider"]);
    expect(lesson!.check.map((primitive) => primitive.kind)).toEqual(["choice", "choice"]);
    expect(lesson!.practice?.generatorId).toBe("chemistry.half-life");
  });
});
