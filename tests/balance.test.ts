import { describe, expect, it } from "vitest";
import {
  applyOperation,
  createBalance,
  equationToString,
  isSolved,
  solveForVariable,
} from "../src/domain/balance/engine.js";
import { Fraction } from "../src/domain/balance/fraction.js";

describe("balance engine", () => {
  it("preserves equality and isolates the variable", () => {
    let state = createBalance({ a: 3, b: 4 }, { a: 0, b: 19 });
    expect(equationToString(state)).toBe("3x + 4 = 19");

    state = applyOperation(state, { id: "sub4", label: "− 4", op: "subtract", value: 4 });
    expect(equationToString(state)).toBe("3x = 15");
    expect(isSolved(state)).toBe(false);

    state = applyOperation(state, { id: "div3", label: "÷ 3", op: "divide", value: 3 });
    expect(equationToString(state)).toBe("x = 5");
    expect(isSolved(state)).toBe(true);
    expect(solveForVariable(state)?.toString()).toBe("5");
  });

  it("keeps rational coefficients exact", () => {
    let state = createBalance({ a: 2, b: 1 }, { a: 0, b: 4 });
    state = applyOperation(state, { id: "div2", label: "÷ 2", op: "divide", value: 2 });
    expect(equationToString(state)).toBe("x + 1/2 = 2");
    state = applyOperation(state, { id: "sub", label: "− 1/2", op: "subtract", value: 0.5 });
    expect(equationToString(state)).toBe("x = 3/2");
    expect(isSolved(state)).toBe(true);
  });

  it("solves variables on both sides", () => {
    const state = createBalance({ a: 4, b: -2 }, { a: 1, b: 7 });
    expect(solveForVariable(state)?.toString()).toBe("3");
    expect(equationToString(state)).toBe("4x − 2 = x + 7");
  });

  it("rejects division by zero and non-unique equations", () => {
    const state = createBalance({ a: 2, b: 1 }, { a: 0, b: 5 });
    expect(() =>
      applyOperation(state, { id: "bad", label: "÷ 0", op: "divide", value: 0 }),
    ).toThrow(/zero/);
    expect(solveForVariable(createBalance({ a: 2, b: 1 }, { a: 2, b: 5 }))).toBeNull();
  });

  it("normalises fractions", () => {
    expect(new Fraction(6, -8).toString()).toBe("-3/4");
    expect(new Fraction(2, 4).toString()).toBe("1/2");
  });
});
