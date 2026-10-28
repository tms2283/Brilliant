import { simplify, parse, evaluate } from "mathjs";
import type { Primitive, PrimitiveResponse } from "../schemas/primitive.js";
import { normalizeEquation } from "./balance/engine.js";

export interface Verdict {
  correct: boolean;
  misconception?: string;
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((value, index) => value === right[index]);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function mathCorrect(response: string, answer: string, tolerance: number): boolean {
  const trimmed = response.trim();
  if (!trimmed) return false;
  try {
    const responseNode = parse(trimmed);
    const answerNode = parse(answer);
    const responseValue = responseNode.evaluate();
    const answerValue = answerNode.evaluate();
    if (typeof responseValue === "number" && typeof answerValue === "number") {
      return Math.abs(responseValue - answerValue) <= tolerance;
    }
    const difference = simplify(`(${trimmed}) - (${answer})`);
    return difference.toString().replace(/\s+/g, "") === "0";
  } catch {
    return false;
  }
}

export function evaluatePrimitive(primitive: Primitive, response: PrimitiveResponse): Verdict {
  switch (primitive.kind) {
    case "toggle": {
      if (!Array.isArray(response)) return { correct: false };
      return { correct: sameSet(response, primitive.answer) };
    }
    case "choice": {
      if (typeof response !== "string") return { correct: false };
      const correct = response === primitive.answer;
      return {
        correct,
        misconception: correct ? undefined : primitive.misconceptionMap[response],
      };
    }
    case "slider": {
      if (!isFiniteNumber(response)) return { correct: false };
      return { correct: Math.abs(response - primitive.answer) <= primitive.tolerance };
    }
    case "math": {
      if (typeof response !== "string") return { correct: false };
      return { correct: mathCorrect(response, primitive.answer, primitive.tolerance) };
    }
    case "balance": {
      if (typeof response !== "string") return { correct: false };
      return { correct: normalizeEquation(response) === normalizeEquation(primitive.answer) };
    }
    case "lever": {
      if (!isFiniteNumber(response)) return { correct: false };
      const leftTorque = primitive.left.forceN * primitive.left.distanceM;
      const rightTorque = primitive.right.forceN * response;
      return { correct: Math.abs(leftTorque - rightTorque) <= primitive.right.forceN * primitive.tolerance };
    }
    case "optics": {
      if (!isFiniteNumber(response)) return { correct: false };
      return { correct: Math.abs(response - primitive.answer) <= primitive.tolerance };
    }
    case "kinetics": {
      if (!isFiniteNumber(response)) return { correct: false };
      return { correct: Math.abs(response - primitive.answer) <= primitive.tolerance };
    }
    case "drag": {
      if (typeof response !== "object" || response === null || Array.isArray(response)) {
        return { correct: false };
      }
      const keys = Object.keys(primitive.answer);
      if (Object.keys(response).length !== keys.length) return { correct: false };
      return {
        correct: keys.every((key) => response[key] === primitive.answer[key]),
      };
    }
    default: {
      const exhaustive: never = primitive;
      return exhaustive;
    }
  }
}

export function describeForTutor(primitive: Primitive): string {
  switch (primitive.kind) {
    case "toggle":
      return `${primitive.prompt} Options: ${primitive.components.map((component) => component.label).join(", ")}.`;
    case "choice":
      return `${primitive.prompt} Options: ${primitive.options.map((option) => option.label).join(", ")}.`;
    case "slider":
      return `${primitive.prompt} Range: ${primitive.min} to ${primitive.max} ${primitive.unit}.`;
    case "math":
      return `${primitive.prompt} Enter a mathematical expression.`;
    case "drag":
      return `${primitive.prompt} Drag one item onto each target.`;
    case "balance":
      return `${primitive.prompt} Apply operations to both sides of a balance.`;
    case "lever":
      return `${primitive.prompt} A ${primitive.left.forceN} N load sits ${primitive.left.distanceM} m from the pivot. The effort is ${primitive.right.forceN} N and can move between ${primitive.right.minM} m and ${primitive.right.maxM} m.`;
    case "optics":
      return `${primitive.prompt} Light passes from ${primitive.medium1} (n=${primitive.n1}) to ${primitive.medium2} (n=${primitive.n2}) at an incident angle of ${primitive.incidentAngleDeg}°.`;
    case "kinetics":
      return `${primitive.prompt} Reactant [${primitive.reactant}] with rate law Rate = k[${primitive.reactant}]^${primitive.order} (k = ${primitive.k}). Target rate: ${primitive.targetRateMPerS} M/s.`;
    default: {
      const exhaustive: never = primitive;
      return exhaustive;
    }
  }
}

export function numericAnswer(primitive: Primitive): number | string | string[] | Record<string, string> {
  return primitive.answer;
}

export function previewMath(input: string): string | null {
  try {
    const node = parse(input);
    const value = node.evaluate();
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(Number(value.toFixed(6)));
    }
    return simplify(node).toString();
  } catch {
    return null;
  }
}

export function evaluateExpression(input: string): number | null {
  try {
    const value = evaluate(input);
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}
