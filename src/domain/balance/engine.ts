import type { BalanceOperation } from "../../schemas/primitive.js";
import { Fraction, ZERO } from "./fraction.js";

export interface LinearSide {
  a: Fraction;
  b: Fraction;
}

export interface BalanceState {
  left: LinearSide;
  right: LinearSide;
  variable: string;
}

export function createBalance(
  left: { a: number; b: number },
  right: { a: number; b: number },
  variable = "x",
): BalanceState {
  return {
    left: { a: new Fraction(left.a), b: new Fraction(left.b) },
    right: { a: new Fraction(right.a), b: new Fraction(right.b) },
    variable,
  };
}

export function applyOperation(state: BalanceState, operation: BalanceOperation): BalanceState {
  const apply = (side: LinearSide): LinearSide => {
    switch (operation.op) {
      case "add":
        return { a: side.a, b: side.b.add(new Fraction(operation.value)) };
      case "subtract":
        return { a: side.a, b: side.b.subtract(new Fraction(operation.value)) };
      case "multiply":
        return {
          a: side.a.multiply(new Fraction(operation.value)),
          b: side.b.multiply(new Fraction(operation.value)),
        };
      case "divide":
        if (operation.value === 0) throw new Error("Cannot divide both sides by zero");
        return {
          a: side.a.divide(new Fraction(operation.value)),
          b: side.b.divide(new Fraction(operation.value)),
        };
      default: {
        const exhaustive: never = operation.op;
        return exhaustive;
      }
    }
  };

  return { left: apply(state.left), right: apply(state.right), variable: state.variable };
}

export function isSolved(state: BalanceState): boolean {
  return state.left.a.isOne() && state.left.b.isZero() && state.right.a.isZero();
}

export function solveForVariable(state: BalanceState): Fraction | null {
  const denominator = state.left.a.subtract(state.right.a);
  if (denominator.isZero()) return null;
  return state.right.b.subtract(state.left.b).divide(denominator);
}

function sideToString(side: LinearSide, variable: string): string {
  if (side.a.isZero()) return side.b.toString();
  const coefficient = side.a;
  const variableTerm = coefficient.isOne()
    ? variable
    : coefficient.equals(new Fraction(-1))
      ? `-${variable}`
      : `${coefficient.toString()}${variable}`;
  if (side.b.isZero()) return variableTerm;
  const sign = side.b.isNegative() ? "−" : "+";
  return `${variableTerm} ${sign} ${new Fraction(Math.abs(side.b.n), side.b.d).toString()}`;
}

export function equationToString(state: BalanceState): string {
  if (isSolved(state)) return `${state.variable} = ${state.right.b.toString()}`;
  return `${sideToString(state.left, state.variable)} = ${sideToString(state.right, state.variable)}`;
}

export function solutionToString(state: BalanceState): string | null {
  const solution = solveForVariable(state);
  return solution === null ? null : `${state.variable} = ${solution.toString()}`;
}

export function normalizeEquation(value: string): string {
  return value.trim().replace(/\s+/g, " ").replace(/−/g, "-").toLowerCase();
}

export function isInitialStateSafe(state: BalanceState): boolean {
  return solveForVariable(state) !== null && !state.left.a.isZero();
}

export { ZERO };
