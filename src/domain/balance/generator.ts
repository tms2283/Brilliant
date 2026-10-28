import type { EvalCheck, Item } from "../../schemas/item.js";
import type { BalanceOperation, BalancePrimitive } from "../../schemas/primitive.js";
import {
  applyOperation,
  createBalance,
  equationToString,
  isSolved,
  solveForVariable,
  type BalanceState,
} from "../balance/engine.js";
import { mulberry32, randInt } from "../content/random.js";

function operationsFor(a: number, b: number): BalanceOperation[] {
  const operations: BalanceOperation[] = [];
  if (b !== 0) {
    operations.push(
      b > 0
        ? { id: "undo-constant", label: `Subtract ${b} from both sides`, op: "subtract", value: b }
        : { id: "undo-constant", label: `Add ${Math.abs(b)} to both sides`, op: "add", value: Math.abs(b) },
    );
  }
  if (a !== 1) {
    operations.push({ id: "undo-coefficient", label: `Divide both sides by ${a}`, op: "divide", value: a });
    operations.push({ id: "scale-up", label: `Multiply both sides by ${a}`, op: "multiply", value: a });
  }
  if (b !== 0) {
    operations.push(
      b > 0
        ? { id: "scale-constant", label: `Add ${b} to both sides`, op: "add", value: b }
        : { id: "scale-constant", label: `Subtract ${Math.abs(b)} from both sides`, op: "subtract", value: Math.abs(b) },
    );
  }
  return operations;
}

function buildBalanceItem(seed: number, twoStep: boolean): Item {
  const rng = mulberry32(seed);
  const solution = randInt(rng, 1, 9);
  const a = twoStep ? randInt(rng, 2, 5) : 1;
  const b = twoStep ? randInt(rng, -8, 8) : randInt(rng, 1, 9);
  const c = a * solution + b;

  const initial = createBalance({ a, b }, { a: 0, b: c });
  const operations = operationsFor(a, b);
  const answer = `${initial.variable} = ${solution}`;

  let path: BalanceState = initial;
  if (b !== 0) {
    path = applyOperation(path, {
      id: "verify-constant",
      label: "constant",
      op: b > 0 ? "subtract" : "add",
      value: Math.abs(b),
    });
  }
  if (a !== 1) {
    path = applyOperation(path, {
      id: "verify-coefficient",
      label: "coefficient",
      op: "divide",
      value: a,
    });
  }

  const independent = solveForVariable(initial);
  const checks: EvalCheck[] = [
    {
      name: "independent-solution",
      passed: independent !== null && independent.toString() === String(solution),
      detail: `${independent?.toString()} vs ${solution}`,
    },
    {
      name: "intended-path-solves",
      passed: isSolved(path) && equationToString(path) === answer,
      detail: equationToString(path),
    },
    {
      name: "initial-not-solved",
      passed: !isSolved(initial),
    },
    {
      name: "operations-legal",
      passed: operations.every(
        (operation) =>
          Number.isFinite(operation.value) &&
          (operation.op !== "divide" || operation.value !== 0) &&
          (operation.op !== "multiply" || operation.value !== 0),
      ),
    },
    {
      name: "answer-canonical",
      passed: /^[a-z] = -?\d+(\/\d+)?$/i.test(answer),
      detail: answer,
    },
  ];

  const primitive: BalancePrimitive = {
    id: `balance-${twoStep ? "two" : "one"}-${seed}`,
    kind: "balance",
    prompt: twoStep
      ? `Solve ${equationToString(initial)} by keeping both sides balanced.`
      : `Solve ${equationToString(initial)} by keeping both sides balanced.`,
    conceptIds: ["balance.operations", "balance.equivalence"],
    hint:
      b === 0
        ? `Divide both sides by ${a} to isolate ${initial.variable}.`
        : `Undo the constant first (${b > 0 ? "subtract" : "add"} ${Math.abs(b)}), then divide by ${a}.`,
    explanation:
      b === 0
        ? `Dividing both sides by ${a} gives ${answer}. Dividing both sides by the same nonzero number preserves equality.`
        : `${b > 0 ? `Subtract ${b} from` : `Add ${Math.abs(b)} to`} both sides to get ${a}${initial.variable} = ${a * solution}. Then divide both sides by ${a} to get ${answer}.`,
    left: { a, b },
    right: { a: 0, b: c },
    variable: "x",
    operations,
    answer,
  };

  return {
    id: primitive.id,
    generatorId: twoStep ? "balance.linear-two-step" : "balance.linear-one-step",
    generatorVersion: "1.0.0",
    seed,
    primitive,
    solutionSteps: [
      b === 0
        ? `Start with ${equationToString(initial)}.`
        : `${b > 0 ? "Subtract" : "Add"} ${Math.abs(b)} ${b > 0 ? "from" : "to"} both sides: ${a}${initial.variable} = ${a * solution}.`,
      a === 1 ? `${initial.variable} is already isolated.` : `Divide both sides by ${a}: ${answer}.`,
      `Check: ${a}(${solution})${b === 0 ? "" : b > 0 ? ` + ${b}` : ` âˆ’ ${Math.abs(b)}`} = ${c}.`,
    ],
    difficultyD: twoStep ? 0.4 : 0.2,
    evalReport: {
      passed: checks.every((check) => check.passed),
      checks,
      evaluatedAt: new Date().toISOString(),
    },
    status: checks.every((check) => check.passed) ? "accepted" : "quarantined",
  };
}

export function generateBalanceOneStep(seed: number): Item {
  return buildBalanceItem(seed, false);
}

export function generateBalanceTwoStep(seed: number): Item {
  return buildBalanceItem(seed, true);
}

