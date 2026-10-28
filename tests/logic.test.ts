import { describe, expect, it } from "vitest";
import { evaluateGate, generateTruthTable } from "../src/domain/logic/evaluator.js";
import { verifyGenerator } from "../src/domain/content/registry.js";
import { generateLogicItem } from "../src/domain/logic/generator.js";

describe("logic domain", () => {
  it("evaluates Boolean gates according to standard truth values", () => {
    expect(evaluateGate("AND", true, true)).toBe(true);
    expect(evaluateGate("AND", true, false)).toBe(false);
    expect(evaluateGate("AND", false, true)).toBe(false);
    expect(evaluateGate("AND", false, false)).toBe(false);

    expect(evaluateGate("OR", true, false)).toBe(true);
    expect(evaluateGate("OR", false, false)).toBe(false);

    expect(evaluateGate("NOT", true)).toBe(false);
    expect(evaluateGate("NOT", false)).toBe(true);

    expect(evaluateGate("XOR", true, true)).toBe(false);
    expect(evaluateGate("XOR", true, false)).toBe(true);
    expect(evaluateGate("XOR", false, false)).toBe(false);

    expect(evaluateGate("NAND", true, true)).toBe(false);
    expect(evaluateGate("NAND", true, false)).toBe(true);

    expect(evaluateGate("NOR", false, false)).toBe(true);
    expect(evaluateGate("NOR", true, false)).toBe(false);
  });

  it("generates 4-row truth tables for two-input operators", () => {
    const table = generateTruthTable("XOR");
    expect(table).toHaveLength(4);
    expect(table[0]).toEqual({ a: false, b: false, output: false });
    expect(table[1]).toEqual({ a: false, b: true, output: true });
    expect(table[2]).toEqual({ a: true, b: false, output: true });
    expect(table[3]).toEqual({ a: true, b: true, output: false });
  });

  it("generates evaluated logic items across 100 seeds with 0 failures", () => {
    expect(verifyGenerator("logic.gates", 100)).toEqual([]);
  });

  it("creates valid item bundles from generator", () => {
    const item = generateLogicItem(42);
    expect(item.status).toBe("accepted");
    expect(item.evalReport.passed).toBe(true);
    expect(item.primitive.kind).toBe("choice");
    expect(item.solutionSteps.length).toBeGreaterThan(0);
  });
});
