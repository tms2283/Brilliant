import { z } from "zod";
import { DomainSchema, IdSchema } from "./common.js";

export const CourseSchema = z.object({
  id: IdSchema,
  version: z.string().min(1),
  title: z.string().min(1),
  domain: DomainSchema,
  description: z.string().min(1),
  status: z.enum(["active", "archived"]),
  levels: z
    .array(
      z.object({
        id: IdSchema,
        title: z.string().min(1),
        lessonIds: z.array(IdSchema).min(1),
      }),
    )
    .min(1),
});
export type Course = z.infer<typeof CourseSchema>;

export const PathNodeKindSchema = z.enum(["lesson", "practice", "review", "check", "warmup", "remediation"]);
export type PathNodeKind = z.infer<typeof PathNodeKindSchema>;

export const PathNodeStatusSchema = z.enum(["locked", "available", "completed", "mastered"]);
export type PathNodeStatus = z.infer<typeof PathNodeStatusSchema>;

export const PathNodeSchema = z.object({
  id: IdSchema,
  kind: PathNodeKindSchema,
  label: z.string().min(1),
  lessonId: IdSchema.optional(),
  conceptId: IdSchema.optional(),
  status: PathNodeStatusSchema,
  reason: z.string().optional(),
});
export type PathNode = z.infer<typeof PathNodeSchema>;

export const PathPlanSchema = z.object({
  id: IdSchema,
  courseId: IdSchema,
  goal: z.string().min(1),
  nodes: z.array(PathNodeSchema),
  generatedAt: z.string().min(1),
});
export type PathPlan = z.infer<typeof PathPlanSchema>;
