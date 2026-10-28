import { z } from "zod";

export const IdSchema = z.string().min(1).max(128);

export const ProvenanceSchema = z.enum(["authored", "textbook", "llm", "user", "generated"]);
export type Provenance = z.infer<typeof ProvenanceSchema>;

export const ConfidenceSchema = z.enum(["low", "medium", "high"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const DomainSchema = z.enum(["circuits", "balance", "mechanics", "optics", "chemistry", "logic", "custom"]);
export type Domain = z.infer<typeof DomainSchema>;
