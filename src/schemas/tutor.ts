import { z } from "zod";
import { IdSchema } from "./common.js";

export const TutorPhaseSchema = z.enum(["learn", "practice", "check", "review"]);
export type TutorPhase = z.infer<typeof TutorPhaseSchema>;

export const TutorRequestSchema = z.object({
  phase: TutorPhaseSchema,
  ladderLevel: z.number().int().min(1).max(3),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  explanation: z.string().min(1).optional(),
  solutionSteps: z.array(z.string().min(1)).default([]),
  conceptIds: z.array(IdSchema).default([]),
  misconception: z.string().min(1).optional(),
});
export type TutorRequest = z.infer<typeof TutorRequestSchema>;

export const TutorReplySchema = z.object({
  message: z.string().min(1),
  ladderLevel: z.number().int().min(1).max(3),
  source: z.enum(["local", "anthropic", "ollama", "local-fallback"]),
  verified: z.boolean(),
  bottomOut: z.boolean(),
});
export type TutorReply = z.infer<typeof TutorReplySchema>;
