import { describe, expect, it } from "vitest";
import { planPath, type PathLesson } from "../src/domain/learner/path.js";
import { emptyConceptState, updateConceptState } from "../src/domain/learner/model.js";
import type { ConceptState } from "../src/schemas/learner.js";

const lessons: PathLesson[] = [
  { id: "l1", title: "First", levelOrdinal: 0, order: 0, conceptIds: ["a"] },
  { id: "l2", title: "Second", levelOrdinal: 0, order: 1, conceptIds: ["b"] },
];
const now = new Date("2026-01-10T12:00:00.000Z");

function state(conceptId: string, correct = true): ConceptState {
  return updateConceptState(emptyConceptState(conceptId), {
    conceptId,
    correct,
    firstAttempt: true,
    ts: "2026-01-10T11:00:00.000Z",
  });
}

describe("path planner", () => {
  it("makes the first lesson available and locks the next", () => {
    const plan = planPath({
      courseId: "c",
      courseTitle: "Course",
      lessons,
      completedLessonIds: new Set(),
      states: new Map(),
      now,
    });
    expect(plan.nodes.find((node) => node.lessonId === "l1")?.status).toBe("available");
    expect(plan.nodes.find((node) => node.lessonId === "l2")?.status).toBe("locked");
    expect(plan.goal).toContain("2 remaining");
  });

  it("unlocks the next lesson and adds practice after completion", () => {
    const plan = planPath({
      courseId: "c",
      courseTitle: "Course",
      lessons,
      completedLessonIds: new Set(["l1"]),
      states: new Map([["a", state("a")]]),
      now,
    });
    expect(plan.nodes.find((node) => node.lessonId === "l1")?.status).toBe("completed");
    expect(plan.nodes.find((node) => node.lessonId === "l2")?.status).toBe("available");
    const practice = plan.nodes.find((node) => node.kind === "practice");
    expect(practice?.lessonId).toBe("l1");
    expect(practice?.status).toBe("available");
  });

  it("puts due reviews at the front", () => {
    const due = state("a");
    due.fsrsCard = { due: "2026-01-10T00:00:00.000Z" };
    const plan = planPath({
      courseId: "c",
      courseTitle: "Course",
      lessons,
      completedLessonIds: new Set(),
      states: new Map([["a", due]]),
      now,
    });
    expect(plan.nodes[0]?.kind).toBe("review");
    expect(plan.nodes[0]?.conceptId).toBe("a");
  });

  it("inserts remediation before the next lesson for weak evidence", () => {
    const weak = state("a", false);
    weak.nAttempts = 2;
    weak.ema = 0.2;
    const plan = planPath({
      courseId: "c",
      courseTitle: "Course",
      lessons,
      completedLessonIds: new Set(),
      states: new Map([["a", weak]]),
      now,
    });
    const remediation = plan.nodes.find((node) => node.kind === "remediation");
    expect(remediation?.conceptId).toBe("a");
    expect(plan.nodes.indexOf(remediation!)).toBeLessThan(
      plan.nodes.findIndex((node) => node.lessonId === "l1"),
    );
  });
});
