import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  type Card,
} from "ts-fsrs";
import type { ConceptState, Mastery } from "../../schemas/learner.js";

const scheduler = fsrs(generatorParameters({ enable_fuzz: false }));

export interface AttemptOutcome {
  conceptId: string;
  correct: boolean;
  firstAttempt: boolean;
  ts: string;
}

export function emptyConceptState(conceptId: string): ConceptState {
  return {
    conceptId,
    theta: 0,
    nAttempts: 0,
    ema: 0,
    mastery: "none",
    fsrsCard: null,
    lastSeen: null,
  };
}

function reviveCard(value: Record<string, unknown> | null, now: Date): Card {
  if (!value) return createEmptyCard(now);
  const due = typeof value.due === "string" ? new Date(value.due) : now;
  const lastReview = typeof value.last_review === "string" ? new Date(value.last_review) : undefined;
  return {
    due,
    stability: Number(value.stability ?? 0),
    difficulty: Number(value.difficulty ?? 0),
    elapsed_days: Number(value.elapsed_days ?? 0),
    scheduled_days: Number(value.scheduled_days ?? 0),
    learning_steps: Number(value.learning_steps ?? 0),
    reps: Number(value.reps ?? 0),
    lapses: Number(value.lapses ?? 0),
    state: Number(value.state ?? 0),
    last_review: lastReview,
  };
}

function storeCard(card: Card): Record<string, unknown> {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review?.toISOString() ?? null,
  };
}

function masteryFor(theta: number, ema: number, nAttempts: number): Mastery {
  if (nAttempts >= 3 && ema >= 0.55 && theta >= 0.6) return "mastered";
  if (nAttempts >= 1) return "provisional";
  return "none";
}

export function updateConceptState(previous: ConceptState | null, outcome: AttemptOutcome): ConceptState {
  const state = previous ?? emptyConceptState(outcome.conceptId);
  const now = new Date(outcome.ts);
  const expected = 1 / (1 + Math.exp(-state.theta));
  const learningRate = Math.max(0.08, 0.6 / (1 + state.nAttempts * 0.4));
  const observed = outcome.correct ? 1 : 0;
  const theta = state.theta + learningRate * (observed - expected);
  const ema = state.ema * 0.75 + observed * 0.25;
  const nAttempts = state.nAttempts + 1;

  const card = reviveCard(state.fsrsCard, now);
  const rating = outcome.correct ? (outcome.firstAttempt ? Rating.Good : Rating.Hard) : Rating.Again;
  const { card: nextCard } = scheduler.next(card, now, rating);

  return {
    conceptId: outcome.conceptId,
    theta,
    nAttempts,
    ema,
    mastery: masteryFor(theta, ema, nAttempts),
    fsrsCard: storeCard(nextCard),
    lastSeen: outcome.ts,
  };
}

export function dueAt(state: ConceptState): Date | null {
  if (!state.fsrsCard) return null;
  const due = state.fsrsCard.due;
  return typeof due === "string" ? new Date(due) : null;
}

export function isDue(state: ConceptState, now = new Date()): boolean {
  const due = dueAt(state);
  return due !== null && due.getTime() <= now.getTime();
}

export interface LearnerSummary {
  concepts: ConceptState[];
  masteredCount: number;
  provisionalCount: number;
  dueReviews: number;
  totalAttempts: number;
}

export function summarizeLearner(states: ConceptState[], now = new Date()): LearnerSummary {
  return {
    concepts: states,
    masteredCount: states.filter((state) => state.mastery === "mastered").length,
    provisionalCount: states.filter((state) => state.mastery === "provisional").length,
    dueReviews: states.filter((state) => isDue(state, now)).length,
    totalAttempts: states.reduce((sum, state) => sum + state.nAttempts, 0),
  };
}
