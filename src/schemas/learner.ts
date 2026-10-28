import { z } from "zod";
import { IdSchema } from "./common.js";

export const MasterySchema = z.enum(["none", "provisional", "mastered"]);
export type Mastery = z.infer<typeof MasterySchema>;

export const ConceptStateSchema = z.object({
  conceptId: IdSchema,
  theta: z.number(),
  nAttempts: z.number().int().min(0),
  ema: z.number().min(0).max(1),
  mastery: MasterySchema,
  fsrsCard: z.record(z.string(), z.unknown()).nullable(),
  lastSeen: z.string().nullable(),
});
export type ConceptState = z.infer<typeof ConceptStateSchema>;

export const LearnerSummarySchema = z.object({
  concepts: z.array(ConceptStateSchema),
  masteredCount: z.number().int().min(0),
  provisionalCount: z.number().int().min(0),
  dueReviews: z.number().int().min(0),
  totalAttempts: z.number().int().min(0),
});
export type LearnerSummary = z.infer<typeof LearnerSummarySchema>;
