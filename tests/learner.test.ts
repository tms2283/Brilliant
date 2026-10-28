import { describe, expect, it } from "vitest";
import {
  dueAt,
  emptyConceptState,
  isDue,
  summarizeLearner,
  updateConceptState,
} from "../src/domain/learner/model.js";

const start = "2026-01-01T12:00:00.000Z";

function attempt(correct: boolean, firstAttempt = true, offsetMinutes = 0) {
  return {
    conceptId: "circuits.ohms-law",
    correct,
    firstAttempt,
    ts: new Date(new Date(start).getTime() + offsetMinutes * 60_000).toISOString(),
  };
}

describe("learner model", () => {
  it("starts empty and updates theta toward observed performance", () => {
    const empty = emptyConceptState("circuits.ohms-law");
    expect(empty.mastery).toBe("none");
    expect(empty.nAttempts).toBe(0);

    const after = updateConceptState(empty, attempt(true));
    expect(after.nAttempts).toBe(1);
    expect(after.theta).toBeGreaterThan(0);
    expect(after.ema).toBeCloseTo(0.25);
    expect(after.mastery).toBe("provisional");
    expect(after.fsrsCard).not.toBeNull();
  });

  it("demotes mastery evidence after a wrong answer", () => {
    let state = emptyConceptState("circuits.ohms-law");
    state = updateConceptState(state, attempt(true, true, 0));
    state = updateConceptState(state, attempt(true, true, 1));
    state = updateConceptState(state, attempt(false, false, 2));
    expect(state.theta).toBeLessThan(0.3);
    expect(state.ema).toBeLessThan(0.75);
    expect(state.mastery).toBe("provisional");
  });

  it("reaches mastered after three strong first-attempt successes", () => {
    let state = emptyConceptState("circuits.ohms-law");
    for (let index = 0; index < 3; index += 1) {
      state = updateConceptState(state, attempt(true, true, index));
    }
    expect(state.mastery).toBe("mastered");
    expect(state.ema).toBeGreaterThan(0.55);
  });

  it("schedules a review in the future and calculates due reviews", () => {
    const state = updateConceptState(emptyConceptState("circuits.ohms-law"), attempt(true));
    const due = dueAt(state);
    expect(due).not.toBeNull();
    expect(due!.getTime()).toBeGreaterThan(new Date(start).getTime());
    expect(isDue(state, new Date(start))).toBe(false);
    expect(isDue(state, new Date(due!.getTime() + 1))).toBe(true);
  });

  it("summarizes concept counts from many states", () => {
    let state = emptyConceptState("circuits.ohms-law");
    for (let index = 0; index < 3; index += 1) {
      state = updateConceptState(state, attempt(true, true, index));
    }
    const summary = summarizeLearner([state], new Date(start));
    expect(summary.masteredCount).toBe(1);
    expect(summary.dueReviews).toBe(0);
    expect(summary.totalAttempts).toBe(3);
  });
});
