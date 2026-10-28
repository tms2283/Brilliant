import { z } from "zod";
import { ConfidenceSchema, DomainSchema, IdSchema, ProvenanceSchema } from "./common.js";
import { ConceptEdgeSchema } from "./concept.js";
import { PathPlanSchema } from "./path.js";

export const TopicRequestSchema = z.object({
  topic: z.string().trim().min(2).max(120),
});
export type TopicRequest = z.infer<typeof TopicRequestSchema>;

export const TopicNodeSchema = z.object({
  id: IdSchema,
  title: z.string().min(1),
  knowledgePoints: z.array(z.string().min(1)).min(1),
  generatorIds: z.array(IdSchema).default([]),
  lessonIds: z.array(IdSchema).default([]),
});
export type TopicNode = z.infer<typeof TopicNodeSchema>;

export const TopicGraphSchema = z.object({
  id: IdSchema,
  topic: z.string().min(1),
  domain: DomainSchema,
  nodes: z.array(TopicNodeSchema).min(1),
  edges: z.array(ConceptEdgeSchema).default([]),
  provenance: ProvenanceSchema,
  confidence: ConfidenceSchema,
});
export type TopicGraph = z.infer<typeof TopicGraphSchema>;

export const CritiqueFindingSchema = z.object({
  code: z.string().min(1),
  severity: z.enum(["error", "warning", "info"]),
  message: z.string().min(1),
});
export type CritiqueFinding = z.infer<typeof CritiqueFindingSchema>;

export const TopicCritiqueSchema = z.object({
  passed: z.boolean(),
  findings: z.array(CritiqueFindingSchema),
  order: z.array(IdSchema),
});
export type TopicCritique = z.infer<typeof TopicCritiqueSchema>;

export const TopicProposalSchema = z.object({
  id: IdSchema,
  graph: TopicGraphSchema,
  critique: TopicCritiqueSchema,
  path: PathPlanSchema,
  curatorStatus: z.enum(["approved", "needs-review", "rejected"]),
  revision: z.number().int().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
export type TopicProposal = z.infer<typeof TopicProposalSchema>;

export const TopicProposalSummarySchema = z.object({
  id: IdSchema,
  topic: z.string().min(1),
  curatorStatus: z.enum(["approved", "needs-review", "rejected"]),
  revision: z.number().int().min(1),
  updatedAt: z.string().min(1),
});
export type TopicProposalSummary = z.infer<typeof TopicProposalSummarySchema>;

export const ReviseTopicRequestSchema = z.object({
  graph: TopicGraphSchema,
});
export type ReviseTopicRequest = z.infer<typeof ReviseTopicRequestSchema>;
