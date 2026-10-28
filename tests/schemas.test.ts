import { describe, expect, it } from "vitest";
import lessonJson from "../src/content/lessons/circuits-01.json";
import { safeValidateLesson } from "../src/schemas/lesson.js";
import { AttemptEventSchema } from "../src/schemas/attempt.js";
import { ConceptEdgeSchema } from "../src/schemas/concept.js";

describe("lesson schema", () => {
  it("accepts the hand-written Circuits fixture", () => {
    const result = safeValidateLesson(lessonJson);
    expect(result.success).toBe(true);
  });

  it("rejects a lesson without a check phase", () => {
    const broken = { ...lessonJson, check: [] };
    expect(safeValidateLesson(broken).success).toBe(false);
  });

  it("rejects a primitive with no concepts", () => {
    const broken = structuredClone(lessonJson);
    broken.learn[0]!.conceptIds = [];
    expect(safeValidateLesson(broken).success).toBe(false);
  });
});

describe("attempt schema", () => {
  it("accepts a minimal learn attempt", () => {
    const result = AttemptEventSchema.safeParse({
      id: "a1",
      itemId: "c1-toggle",
      lessonId: "circuits-01",
      conceptIds: ["circuits.series"],
      phase: "learn",
      response: ["s1", "s2"],
      correct: true,
      firstAttempt: true,
      hintLevel: 0,
      revealed: false,
      durationMs: 4000,
      ts: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });
});

describe("concept edge schema", () => {
  it("rejects a self-edge", () => {
    const edge = {
      from: "a",
      to: "a",
      type: "prerequisite" as const,
      provenance: "authored" as const,
      confidence: "high" as const,
    };
    expect(ConceptEdgeSchema.safeParse(edge).success).toBe(false);
  });

  it("requires a weight on encompassing edges", () => {
    const edge = {
      from: "a",
      to: "b",
      type: "encompasses" as const,
      provenance: "authored" as const,
      confidence: "high" as const,
    };
    expect(ConceptEdgeSchema.safeParse(edge).success).toBe(false);
  });
});
