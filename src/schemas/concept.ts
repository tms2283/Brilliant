import { z } from "zod";
import { ConfidenceSchema, DomainSchema, IdSchema, ProvenanceSchema } from "./common.js";

export const ConceptEdgeTypeSchema = z.enum(["prerequisite", "encompasses", "confusable"]);
export type ConceptEdgeType = z.infer<typeof ConceptEdgeTypeSchema>;

export const ConceptSchema = z.object({
  id: IdSchema,
  domain: DomainSchema,
  title: z.string().min(1),
  knowledgePoints: z.array(z.string().min(1)).min(1),
  generatorIds: z.array(IdSchema).default([]),
  provenance: ProvenanceSchema,
  confidence: ConfidenceSchema,
});
export type Concept = z.infer<typeof ConceptSchema>;

export const ConceptEdgeSchema = z
  .object({
    from: IdSchema,
    to: IdSchema,
    type: ConceptEdgeTypeSchema,
    weight: z.number().min(0).max(1).optional(),
    provenance: ProvenanceSchema,
    confidence: ConfidenceSchema,
  })
  .refine((edge) => edge.from !== edge.to, { message: "A concept cannot depend on itself" })
  .refine((edge) => edge.type !== "encompasses" || edge.weight !== undefined, {
    message: "Encompassing edges require a weight",
  });
export type ConceptEdge = z.infer<typeof ConceptEdgeSchema>;
