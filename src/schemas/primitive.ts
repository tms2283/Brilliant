import { z } from "zod";
import { IdSchema } from "./common.js";

const PrimitiveBase = z.object({
  id: IdSchema,
  prompt: z.string().min(1),
  conceptIds: z.array(IdSchema).min(1),
  hint: z.string().min(1),
  explanation: z.string().min(1),
});

export const TogglePrimitiveSchema = PrimitiveBase.extend({
  kind: z.literal("toggle"),
  components: z.array(z.object({ id: IdSchema, label: z.string().min(1), onByDefault: z.boolean().default(false) })).min(1),
  answer: z.array(IdSchema),
});
export type TogglePrimitive = z.infer<typeof TogglePrimitiveSchema>;

export const ChoicePrimitiveSchema = PrimitiveBase.extend({
  kind: z.literal("choice"),
  options: z.array(z.object({ id: IdSchema, label: z.string().min(1) })).min(2),
  answer: IdSchema,
  misconceptionMap: z.record(z.string(), z.string()).default({}),
});
export type ChoicePrimitive = z.infer<typeof ChoicePrimitiveSchema>;

export const SliderPrimitiveSchema = PrimitiveBase.extend({
  kind: z.literal("slider"),
  min: z.number(),
  max: z.number(),
  step: z.number().positive(),
  unit: z.string().default(""),
  answer: z.number(),
  tolerance: z.number().min(0).default(0.01),
});
export type SliderPrimitive = z.infer<typeof SliderPrimitiveSchema>;

export const MathPrimitiveSchema = PrimitiveBase.extend({
  kind: z.literal("math"),
  answer: z.string().min(1),
  variables: z.array(z.string().min(1)).default([]),
  tolerance: z.number().min(0).default(1e-6),
});
export type MathPrimitive = z.infer<typeof MathPrimitiveSchema>;

export const DragPrimitiveSchema = PrimitiveBase.extend({
  kind: z.literal("drag"),
  items: z.array(z.object({ id: IdSchema, label: z.string().min(1) })).min(1),
  targets: z.array(z.object({ id: IdSchema, label: z.string().min(1) })).min(1),
  answer: z.record(z.string(), IdSchema),
});
export type DragPrimitive = z.infer<typeof DragPrimitiveSchema>;

export const BalanceOperationSchema = z.object({
  id: IdSchema,
  label: z.string().min(1),
  op: z.enum(["add", "subtract", "multiply", "divide"]),
  value: z.number(),
});
export type BalanceOperation = z.infer<typeof BalanceOperationSchema>;

export const LinearSideSchema = z.object({
  a: z.number(),
  b: z.number(),
});
export type LinearSide = z.infer<typeof LinearSideSchema>;

export const BalancePrimitiveSchema = PrimitiveBase.extend({
  kind: z.literal("balance"),
  left: LinearSideSchema,
  right: LinearSideSchema,
  variable: z.string().min(1).default("x"),
  operations: z.array(BalanceOperationSchema).min(1),
  answer: z.string().min(1),
});
export type BalancePrimitive = z.infer<typeof BalancePrimitiveSchema>;

export const LeverPrimitiveSchema = PrimitiveBase.extend({
  kind: z.literal("lever"),
  left: z.object({
    forceN: z.number().positive(),
    distanceM: z.number().positive(),
    label: z.string().min(1).default("Load"),
  }),
  right: z.object({
    forceN: z.number().positive(),
    minM: z.number().positive(),
    maxM: z.number().positive(),
    stepM: z.number().positive().default(0.1),
    label: z.string().min(1).default("Effort"),
  }),
  answer: z.number().positive(),
  tolerance: z.number().min(0).default(0.05),
});
export type LeverPrimitive = z.infer<typeof LeverPrimitiveSchema>;

export const OpticsPrimitiveSchema = PrimitiveBase.extend({
  kind: z.literal("optics"),
  n1: z.number().positive(),
  n2: z.number().positive(),
  medium1: z.string().min(1).default("Air"),
  medium2: z.string().min(1).default("Glass"),
  incidentAngleDeg: z.number().min(0).max(85),
  minRefractedDeg: z.number().min(0).default(0),
  maxRefractedDeg: z.number().min(0).default(85),
  stepDeg: z.number().positive().default(0.5),
  answer: z.number().min(0).max(90),
  tolerance: z.number().min(0).default(1.0),
});
export type OpticsPrimitive = z.infer<typeof OpticsPrimitiveSchema>;

export const KineticsPrimitiveSchema = PrimitiveBase.extend({
  kind: z.literal("kinetics"),
  reactant: z.string().min(1).default("A"),
  order: z.number().int().min(0).max(2).default(1),
  k: z.number().positive(),
  minConcM: z.number().positive().default(0.2),
  maxConcM: z.number().positive().default(3.0),
  stepConcM: z.number().positive().default(0.1),
  targetRateMPerS: z.number().positive(),
  answer: z.number().positive(),
  tolerance: z.number().min(0).default(0.08),
});
export type KineticsPrimitive = z.infer<typeof KineticsPrimitiveSchema>;

export const PrimitiveSchema = z.discriminatedUnion("kind", [
  TogglePrimitiveSchema,
  ChoicePrimitiveSchema,
  SliderPrimitiveSchema,
  MathPrimitiveSchema,
  DragPrimitiveSchema,
  BalancePrimitiveSchema,
  LeverPrimitiveSchema,
  OpticsPrimitiveSchema,
  KineticsPrimitiveSchema,
]);
export type Primitive = z.infer<typeof PrimitiveSchema>;
export type PrimitiveKind = Primitive["kind"];

export type PrimitiveResponse = string | number | string[] | Record<string, string>;
