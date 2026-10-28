import { z } from "zod";
import { ConfidenceSchema, DomainSchema, IdSchema, ProvenanceSchema } from "./common.js";
import { PrimitiveSchema } from "./primitive.js";

export const LessonPracticeSpecSchema = z.object({
  generatorId: IdSchema,
  count: z.number().int().min(1).max(50),
  config: z.record(z.string(), z.unknown()).default({}),
});
export type LessonPracticeSpec = z.infer<typeof LessonPracticeSpecSchema>;

export const LessonDocSchema = z.object({
  id: IdSchema,
  version: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  conceptIds: z.array(IdSchema).min(1),
  learn: z.array(PrimitiveSchema).min(1),
  check: z.array(PrimitiveSchema).min(1),
  takeaway: z.object({ title: z.string().min(1), body: z.string().min(1) }),
  practice: LessonPracticeSpecSchema.optional(),
  metadata: z.object({
    domain: DomainSchema,
    courseId: IdSchema,
    levelId: IdSchema,
    order: z.number().int().min(0),
    provenance: ProvenanceSchema,
    confidence: ConfidenceSchema,
  }),
});
export type LessonDoc = z.infer<typeof LessonDocSchema>;

export function validateLesson(input: unknown): LessonDoc {
  return LessonDocSchema.parse(input);
}

export function safeValidateLesson(input: unknown) {
  return LessonDocSchema.safeParse(input);
}
