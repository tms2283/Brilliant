import { z } from "zod";
import { IdSchema } from "./common.js";
import { PrimitiveSchema } from "./primitive.js";

export const ItemStatusSchema = z.enum(["candidate", "accepted", "quarantined"]);
export type ItemStatus = z.infer<typeof ItemStatusSchema>;

export const EvalCheckSchema = z.object({
  name: z.string().min(1),
  passed: z.boolean(),
  detail: z.string().optional(),
});
export type EvalCheck = z.infer<typeof EvalCheckSchema>;

export const EvalReportSchema = z.object({
  passed: z.boolean(),
  checks: z.array(EvalCheckSchema).min(1),
  evaluatedAt: z.string().min(1),
});
export type EvalReport = z.infer<typeof EvalReportSchema>;

export const ItemSchema = z.object({
  id: IdSchema,
  generatorId: IdSchema,
  generatorVersion: z.string().min(1),
  seed: z.number().int(),
  primitive: PrimitiveSchema,
  solutionSteps: z.array(z.string().min(1)).min(1),
  difficultyD: z.number(),
  evalReport: EvalReportSchema,
  status: ItemStatusSchema,
});
export type Item = z.infer<typeof ItemSchema>;
