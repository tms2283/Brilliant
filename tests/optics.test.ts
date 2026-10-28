import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/content/index.js";
import { verifyGenerator } from "../src/domain/content/registry.js";
import { evaluatePrimitive } from "../src/domain/evaluate.js";
import { OpticsPrimitiveSchema } from "../src/schemas/primitive.js";

const opticsPrism = OpticsPrimitiveSchema.parse({
  id: "test-optics",
  kind: "optics",
  prompt: "Refract the beam.",
  conceptIds: ["optics.refraction"],
  hint: "Use Snell's law: n1 sin(θ1) = n2 sin(θ2).",
  explanation: "1.00 sin(45°) = 1.50 sin(28.1°).",
  n1: 1.0,
  n2: 1.5,
  medium1: "Air",
  medium2: "Glass",
  incidentAngleDeg: 45,
  minRefractedDeg: 10,
  maxRefractedDeg: 60,
  stepDeg: 0.5,
  answer: 28.1,
  tolerance: 1.0,
});

describe("optics", () => {
  it("accepts a refracted angle within tolerance", () => {
    expect(evaluatePrimitive(opticsPrism, 28.1).correct).toBe(true);
    expect(evaluatePrimitive(opticsPrism, 28.5).correct).toBe(true);
    expect(evaluatePrimitive(opticsPrism, 27.5).correct).toBe(true);
    expect(evaluatePrimitive(opticsPrism, 30.0).correct).toBe(false);
    expect(evaluatePrimitive(opticsPrism, 20.0).correct).toBe(false);
  });

  it("generates evaluated refraction items across 100 seeds", () => {
    expect(verifyGenerator("optics.refraction", 100)).toEqual([]);
  });

  it("generates evaluated thin lens items across 100 seeds", () => {
    expect(verifyGenerator("optics.thin-lens", 100)).toEqual([]);
  });

  it("ships optics-01 with refraction manipulative, checks, and practice", () => {
    const lesson = LESSONS.find((entry) => entry.id === "optics-01");
    expect(lesson).toBeDefined();
    expect(lesson!.learn.map((primitive) => primitive.kind)).toEqual(["optics", "choice"]);
    expect(lesson!.check.map((primitive) => primitive.kind)).toEqual(["optics", "choice"]);
    expect(lesson!.practice?.generatorId).toBe("optics.refraction");
  });

  it("ships optics-02 with thin lens checks and practice", () => {
    const lesson = LESSONS.find((entry) => entry.id === "optics-02");
    expect(lesson).toBeDefined();
    expect(lesson!.learn.map((primitive) => primitive.kind)).toEqual(["slider", "choice"]);
    expect(lesson!.check.map((primitive) => primitive.kind)).toEqual(["slider", "choice"]);
    expect(lesson!.practice?.generatorId).toBe("optics.thin-lens");
  });
});
