import { assign, setup } from "xstate";
import type { AttemptEvent } from "../schemas/attempt.js";
import type { LessonDoc } from "../schemas/lesson.js";
import type { Primitive, PrimitiveResponse } from "../schemas/primitive.js";
import { evaluatePrimitive, type Verdict } from "./evaluate.js";

export type PlayerPhase = "learn" | "check";

export interface PlayerContext {
  lesson: LessonDoc;
  phase: PlayerPhase;
  learnIndex: number;
  checkIndex: number;
  itemStartedAt: number;
  hintLevel: number;
  tries: number;
  response: PrimitiveResponse | null;
  verdict: Verdict | null;
  revealed: boolean;
  checkResults: boolean[];
  onAttempt?: (attempt: AttemptEvent) => void;
}

export interface PlayerInput {
  lesson: LessonDoc;
  onAttempt?: (attempt: AttemptEvent) => void;
}

export type PlayerEvent =
  | { type: "SUBMIT"; response: PrimitiveResponse }
  | { type: "CONTINUE" }
  | { type: "RETRY" }
  | { type: "REVEAL" }
  | { type: "HINT" }
  | { type: "RESTART" };

export function currentPrimitive(context: PlayerContext): Primitive {
  const list = context.phase === "learn" ? context.lesson.learn : context.lesson.check;
  const index = context.phase === "learn" ? context.learnIndex : context.checkIndex;
  return list[Math.min(index, list.length - 1)]!;
}

function makeAttempt(
  context: PlayerContext,
  response: PrimitiveResponse,
  verdict: Verdict,
  revealed: boolean,
  firstAttempt: boolean,
): AttemptEvent {
  return {
    id: crypto.randomUUID(),
    itemId: currentPrimitive(context).id,
    lessonId: context.lesson.id,
    conceptIds: currentPrimitive(context).conceptIds,
    phase: context.phase,
    response,
    correct: verdict.correct,
    firstAttempt,
    hintLevel: context.hintLevel,
    revealed,
    durationMs: Math.max(0, Date.now() - context.itemStartedAt),
    ts: new Date().toISOString(),
  };
}

function freshItem(now = Date.now()) {
  return {
    itemStartedAt: now,
    hintLevel: 0,
    tries: 0,
    response: null,
    verdict: null,
    revealed: false,
  } satisfies Partial<PlayerContext>;
}

export const playerMachine = setup({
  types: {
    context: {} as PlayerContext,
    events: {} as PlayerEvent,
    input: {} as PlayerInput,
  },
  guards: {
    isCorrect: ({ context, event }) => {
      if (event.type !== "SUBMIT") return false;
      return evaluatePrimitive(currentPrimitive(context), event.response).correct;
    },
    hasMoreLearn: ({ context }) => context.learnIndex + 1 < context.lesson.learn.length,
    hasMoreCheck: ({ context }) => context.checkIndex + 1 < context.lesson.check.length,
    canRetry: ({ context }) => !context.revealed && context.tries < 2,
  },
  actions: {
    submit: assign(({ context, event }) => {
      if (event.type !== "SUBMIT") return {};
      const verdict = evaluatePrimitive(currentPrimitive(context), event.response);
      const attempt = makeAttempt(context, event.response, verdict, false, context.tries === 0);
      context.onAttempt?.(attempt);
      return {
        response: event.response,
        verdict,
        tries: context.tries + 1,
        checkResults:
          context.phase === "check" ? [...context.checkResults, verdict.correct] : context.checkResults,
      };
    }),
    hint: assign(({ context }) => ({ hintLevel: Math.min(5, context.hintLevel + 1) })),
    reveal: assign(({ context }) => {
      const verdict: Verdict = { correct: false };
      const attempt = makeAttempt(context, context.response ?? "", verdict, true, false);
      context.onAttempt?.(attempt);
      return { revealed: true, verdict };
    }),
    retry: assign(() => ({
      itemStartedAt: Date.now(),
      response: null,
      verdict: null,
      revealed: false,
    })),
    advanceLearn: assign(({ context }) => ({
      learnIndex: context.learnIndex + 1,
      ...freshItem(),
    })),
    enterCheck: assign(({ context }) => ({
      phase: "check" as const,
      checkIndex: 0,
      checkResults: context.checkResults,
      ...freshItem(),
    })),
    advanceCheck: assign(({ context }) => ({
      checkIndex: context.checkIndex + 1,
      ...freshItem(),
    })),
    restart: assign(() => ({
      phase: "learn" as const,
      learnIndex: 0,
      checkIndex: 0,
      checkResults: [] as boolean[],
      ...freshItem(),
    })),
  },
}).createMachine({
  id: "lessonPlayer",
  initial: "learn",
  context: ({ input }) => ({
    lesson: input.lesson,
    phase: "learn",
    learnIndex: 0,
    checkIndex: 0,
    itemStartedAt: Date.now(),
    hintLevel: 0,
    tries: 0,
    response: null,
    verdict: null,
    revealed: false,
    checkResults: [],
    onAttempt: input.onAttempt,
  }),
  states: {
    learn: {
      on: {
        SUBMIT: [
          { guard: "isCorrect", target: "learnCorrect", actions: "submit" },
          { target: "learnWrong", actions: "submit" },
        ],
        HINT: { actions: "hint" },
      },
    },
    learnCorrect: {
      on: { CONTINUE: { target: "nextAfterLearn" } },
    },
    learnWrong: {
      on: {
        RETRY: { guard: "canRetry", target: "learn", actions: "retry" },
        REVEAL: { target: "learnRevealed", actions: "reveal" },
        CONTINUE: { target: "nextAfterLearn" },
      },
    },
    learnRevealed: {
      on: { CONTINUE: { target: "nextAfterLearn" } },
    },
    nextAfterLearn: {
      always: [
        { guard: "hasMoreLearn", target: "learn", actions: "advanceLearn" },
        { target: "check", actions: "enterCheck" },
      ],
    },
    check: {
      on: {
        SUBMIT: [
          { guard: "isCorrect", target: "checkCorrect", actions: "submit" },
          { target: "checkWrong", actions: "submit" },
        ],
      },
    },
    checkCorrect: {
      on: { CONTINUE: { target: "nextAfterCheck" } },
    },
    checkWrong: {
      on: { CONTINUE: { target: "nextAfterCheck" } },
    },
    nextAfterCheck: {
      always: [
        { guard: "hasMoreCheck", target: "check", actions: "advanceCheck" },
        { target: "complete" },
      ],
    },
    complete: {
      on: { RESTART: { target: "learn", actions: "restart" } },
    },
  },
});
