import { describe, expect, it } from "vitest";
import { checkCircuit, solveCircuit } from "../src/domain/circuits/solver.js";

describe("DC circuit solver", () => {
  it("solves a series circuit", () => {
    const solution = solveCircuit({
      mode: "series",
      sourceVoltage: 12,
      resistors: [
        { id: "r1", resistance: 6 },
        { id: "r2", resistance: 6 },
      ],
    });
    expect(solution.equivalentResistance).toBe(12);
    expect(solution.totalCurrent).toBeCloseTo(1);
    expect(solution.branches.map((branch) => branch.voltageDrop)).toEqual([6, 6]);
  });

  it("solves a parallel circuit", () => {
    const solution = solveCircuit({
      mode: "parallel",
      sourceVoltage: 12,
      resistors: [
        { id: "r1", resistance: 6 },
        { id: "r2", resistance: 6 },
      ],
    });
    expect(solution.equivalentResistance).toBeCloseTo(3);
    expect(solution.totalCurrent).toBeCloseTo(4);
    expect(solution.branches.map((branch) => branch.current)).toEqual([2, 2]);
  });

  it("conserves energy in both modes", () => {
    for (const mode of ["series", "parallel"] as const) {
      const circuit = {
        mode,
        sourceVoltage: 9,
        resistors: [
          { id: "r1", resistance: 2 },
          { id: "r2", resistance: 3 },
          { id: "r3", resistance: 6 },
        ],
      };
      const solution = solveCircuit(circuit);
      const checks = checkCircuit(circuit, solution);
      expect(checks.filter((check) => !check.passed)).toEqual([]);
    }
  });

  it("rejects invalid circuits", () => {
    expect(() =>
      solveCircuit({ mode: "series", sourceVoltage: 9, resistors: [] }),
    ).toThrow(/at least one/);
    expect(() =>
      solveCircuit({ mode: "series", sourceVoltage: 9, resistors: [{ id: "r1", resistance: 0 }] }),
    ).toThrow(/positive/);
  });
});
