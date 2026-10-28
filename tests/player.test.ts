import { createActor } from "xstate";
import { describe, expect, it } from "vitest";
import lessonJson from "../src/content/lessons/circuits-01.json";
import { playerMachine } from "../src/domain/player.js";
import { validateLesson } from "../src/schemas/lesson.js";
import type { AttemptEvent } from "../src/schemas/attempt.js";

const lesson = validateLesson(lessonJson);

function startPlayer() {
  const attempts: AttemptEvent[] = [];
  const actor = createActor(playerMachine, {
    input: { lesson, onAttempt: (attempt) => attempts.push(attempt) },
  });
  actor.start();
  return { actor, attempts };
}

describe("lesson player machine", () => {
  it("runs learn, retry, reveal, check, and complete", () => {
    const { actor, attempts } = startPlayer();
    expect(actor.getSnapshot().value).toBe("learn");

    actor.send({ type: "SUBMIT", response: ["s1"] });
    expect(actor.getSnapshot().value).toBe("learnWrong");
    expect(actor.getSnapshot().context.verdict?.correct).toBe(false);

    actor.send({ type: "RETRY" });
    expect(actor.getSnapshot().value).toBe("learn");
    expect(actor.getSnapshot().context.tries).toBe(1);

    actor.send({ type: "SUBMIT", response: ["s1"] });
    expect(actor.getSnapshot().value).toBe("learnWrong");

    actor.send({ type: "REVEAL" });
    expect(actor.getSnapshot().value).toBe("learnRevealed");
    expect(actor.getSnapshot().context.revealed).toBe(true);

    actor.send({ type: "CONTINUE" });
    expect(actor.getSnapshot().context.learnIndex).toBe(1);

    actor.send({ type: "SUBMIT", response: "b" });
    expect(actor.getSnapshot().value).toBe("learnCorrect");

    actor.send({ type: "CONTINUE" });
    actor.send({ type: "SUBMIT", response: 11 });
    expect(actor.getSnapshot().value).toBe("learnWrong");

    actor.send({ type: "RETRY" });
    actor.send({ type: "SUBMIT", response: 12 });
    expect(actor.getSnapshot().value).toBe("learnCorrect");

    actor.send({ type: "CONTINUE" });
    expect(actor.getSnapshot().context.phase).toBe("check");

    actor.send({ type: "SUBMIT", response: "c" });
    expect(actor.getSnapshot().value).toBe("checkCorrect");
    actor.send({ type: "CONTINUE" });

    actor.send({ type: "SUBMIT", response: "b" });
    expect(actor.getSnapshot().value).toBe("checkWrong");
    actor.send({ type: "CONTINUE" });

    expect(actor.getSnapshot().value).toBe("complete");
    expect(actor.getSnapshot().context.checkResults).toEqual([true, false]);
    expect(attempts).toHaveLength(8);
    expect(attempts.map((attempt) => attempt.phase)).toEqual([
      "learn",
      "learn",
      "learn",
      "learn",
      "learn",
      "learn",
      "check",
      "check",
    ]);
    expect(attempts.filter((attempt) => attempt.revealed)).toHaveLength(1);
  });

  it("tracks hint level on the attempt", () => {
    const { actor, attempts } = startPlayer();
    actor.send({ type: "HINT" });
    actor.send({ type: "HINT" });
    actor.send({ type: "SUBMIT", response: "b" });
    expect(attempts[0]?.hintLevel).toBe(2);
    expect(actor.getSnapshot().value).toBe("learnWrong");
  });

  it("blocks a third retry", () => {
    const { actor } = startPlayer();
    actor.send({ type: "SUBMIT", response: ["s1"] });
    actor.send({ type: "RETRY" });
    actor.send({ type: "SUBMIT", response: ["s1"] });
    expect(actor.getSnapshot().context.tries).toBe(2);
    actor.send({ type: "RETRY" });
    expect(actor.getSnapshot().value).toBe("learnWrong");
  });

  it("restarts from complete", () => {
    const { actor } = startPlayer();
    for (let i = 0; i < 3; i += 1) {
      actor.send({ type: "SUBMIT", response: i === 0 ? ["s1", "s2"] : i === 1 ? "b" : 12 });
      actor.send({ type: "CONTINUE" });
    }
    actor.send({ type: "SUBMIT", response: "c" });
    actor.send({ type: "CONTINUE" });
    actor.send({ type: "SUBMIT", response: "b" });
    actor.send({ type: "CONTINUE" });
    expect(actor.getSnapshot().value).toBe("complete");
    actor.send({ type: "RESTART" });
    expect(actor.getSnapshot().value).toBe("learn");
    expect(actor.getSnapshot().context.learnIndex).toBe(0);
  });
});
