import { z } from "zod";
import { IdSchema } from "./common.js";
import { PrimitiveResponse } from "./primitive.js";

export const AttemptPhaseSchema = z.enum(["learn", "check", "practice", "review", "placement"]);
export type AttemptPhase = z.infer<typeof AttemptPhaseSchema>;

export const AttemptEventSchema = z.object({
  id: IdSchema,
  itemId: IdSchema,
  lessonId: IdSchema,
  conceptIds: z.array(IdSchema).min(1),
  phase: AttemptPhaseSchema,
  response: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
    z.record(z.string(), z.string()),
  ]) satisfies z.ZodType<PrimitiveResponse>,
  correct: z.boolean(),
  firstAttempt: z.boolean(),
  hintLevel: z.number().int().min(0).max(5),
  revealed: z.boolean(),
  durationMs: z.number().int().min(0),
  ts: z.string().min(1),
});
export type AttemptEvent = z.infer<typeof AttemptEventSchema>;
