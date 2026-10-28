import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/content/index.js";
import { verifyGenerator } from "../src/domain/content/registry.js";
import { evaluatePrimitive } from "../src/domain/evaluate.js";
import { LeverPrimitiveSchema } from "../src/schemas/primitive.js";

const lever = LeverPrimitiveSchema.parse({
  id: "test-lever",
  kind: "lever",
  prompt: "Balance the lever.",
  conceptIds: ["mechanics.torque"],
  hint: "Match the torques.",
  explanation: "10 N at 4 m has the same torque as 20 N at 2 m.",
  left: { forceN: 20, distanceM: 2, label: "Load" },
  right: { forceN: 10, minM: 0.5, maxM: 5, stepM: 0.1, label: "Effort" },
  answer: 4,
  tolerance: 0.05,
});

describe("mechanics", () => {
  it("accepts a lever position that balances torque", () => {
    expect(evaluatePrimitive(lever, 4).correct).toBe(true);
    expect(evaluatePrimitive(lever, 3.99).correct).toBe(true);
    expect(evaluatePrimitive(lever, 3.9).correct).toBe(false);
    expect(evaluatePrimitive(lever, 4.5).correct).toBe(false);
  });

  it("generates evaluated torque items across 100 seeds", () => {
    expect(verifyGenerator("mechanics.torque", 100)).toEqual([]);
  });

  it("generates evaluated mechanical advantage items across 100 seeds", () => {
    expect(verifyGenerator("mechanics.mechanical-advantage", 100)).toEqual([]);
  });

  it("ships the torque lesson with lever checks and practice", () => {
    const lesson = LESSONS.find((entry) => entry.id === "mechanics-01");
    expect(lesson).toBeDefined();
    expect(lesson!.learn.map((primitive) => primitive.kind)).toEqual(["lever", "choice"]);
    expect(lesson!.check.map((primitive) => primitive.kind)).toEqual(["lever", "choice"]);
    expect(lesson!.practice?.generatorId).toBe("mechanics.torque");
  });

  it("ships the mechanical advantage lesson with lever checks and practice", () => {
    const lesson = LESSONS.find((entry) => entry.id === "mechanics-02");
    expect(lesson).toBeDefined();
    expect(lesson!.learn.map((primitive) => primitive.kind)).toEqual(["lever", "choice"]);
    expect(lesson!.check.map((primitive) => primitive.kind)).toEqual(["lever", "choice"]);
    expect(lesson!.practice?.generatorId).toBe("mechanics.mechanical-advantage");
  });
});
