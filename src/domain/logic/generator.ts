import type { EvalCheck, Item } from "../../schemas/item.js";
import type { ChoicePrimitive } from "../../schemas/primitive.js";
import { mulberry32, pick } from "../content/random.js";
import { evaluateGate, type GateOp } from "./evaluator.js";

const GATES: GateOp[] = ["AND", "OR", "XOR", "NAND", "NOR"];

export function generateLogicItem(seed: number): Item {
  const rng = mulberry32(seed);
  const gate = pick(rng, GATES);
  const inA = rng() > 0.5;
  const inB = rng() > 0.5;
  const expectedBool = evaluateGate(gate, inA, inB);
  const expectedStr = expectedBool ? "TRUE (1)" : "FALSE (0)";

  const prompt = `Input A is ${inA ? "TRUE (1)" : "FALSE (0)"} and Input B is ${inB ? "TRUE (1)" : "FALSE (0)"}. What is the output of a two-input ${gate} gate?`;

  const options = [
    { id: "true", label: "TRUE (1)" },
    { id: "false", label: "FALSE (0)" },
    { id: "undefined", label: "UNDEFINED (Floating)" },
    { id: "oscillating", label: "OSCILLATING" },
  ];

  const answerId = expectedBool ? "true" : "false";

  const explanation = `${gate} operation on (${inA ? "1" : "0"}, ${inB ? "1" : "0"}) evaluates to ${expectedStr}.`;

  const misconceptionMap: Record<string, string> = {
    [expectedBool ? "false" : "true"]: `Re-check the truth table for the ${gate} operator.`,
    undefined: "Digital logic gates always resolve to a definite binary high or low level.",
    oscillating: "Combinational logic gates produce stable static outputs for fixed inputs.",
  };

  const primitive: ChoicePrimitive = {
    id: `logic-choice-${seed}`,
    kind: "choice",
    prompt,
    conceptIds: ["logic.boolean-operators"],
    hint: `Recall the definition of a ${gate} gate: it outputs TRUE only when its truth condition is met.`,
    explanation,
    options,
    answer: answerId,
    misconceptionMap,
  };

  const checks: EvalCheck[] = [
    {
      name: "valid-gate-output",
      passed: typeof expectedBool === "boolean",
      detail: `${gate}(${inA}, ${inB}) = ${expectedBool}`,
    },
    {
      name: "valid-answer-option",
      passed: options.some((opt) => opt.id === answerId),
      detail: `Answer option ${answerId} exists`,
    },
  ];

  const passed = checks.every((c) => c.passed);

  return {
    id: primitive.id,
    generatorId: "logic.gates",
    generatorVersion: "1.0.0",
    seed,
    primitive,
    solutionSteps: [
      `Identify gate: ${gate}`,
      `Identify inputs: A = ${inA ? "1" : "0"}, B = ${inB ? "1" : "0"}`,
      `Evaluate ${gate}(${inA ? "1" : "0"}, ${inB ? "1" : "0"}) = ${expectedBool ? "1" : "0"}`,
    ],
    difficultyD: gate === "XOR" || gate === "NAND" || gate === "NOR" ? 0.4 : 0.2,
    evalReport: {
      passed,
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: passed ? "accepted" : "quarantined",
  };
}
