import type { Primitive, PrimitiveResponse } from "../../schemas/primitive.js";

export function defaultResponse(primitive: Primitive): PrimitiveResponse {
  switch (primitive.kind) {
    case "toggle":
      return primitive.components.filter((component) => component.onByDefault).map((component) => component.id);
    case "choice":
      return "";
    case "slider": {
      const middle = (primitive.min + primitive.max) / 2;
      return Math.round(middle / primitive.step) * primitive.step;
    }
    case "math":
      return "";
    case "drag":
      return {};
    case "balance":
      return "";
    case "lever": {
      const middle = (primitive.right.minM + primitive.right.maxM) / 2;
      return Number((Math.round(middle / primitive.right.stepM) * primitive.right.stepM).toFixed(4));
    }
    case "optics":
      return primitive.minRefractedDeg;
    case "kinetics":
      return primitive.minConcM;
    default: {
      const exhaustive: never = primitive;
      return exhaustive;
    }
  }
}

export function formatAnswer(primitive: Primitive): string {
  switch (primitive.kind) {
    case "toggle":
      return primitive.answer.length === 0
        ? "No components"
        : primitive.answer
            .map((id) => primitive.components.find((component) => component.id === id)?.label ?? id)
            .join(", ");
    case "choice":
      return primitive.options.find((option) => option.id === primitive.answer)?.label ?? primitive.answer;
    case "slider":
      return `${primitive.answer} ${primitive.unit}`.trim();
    case "math":
      return primitive.answer;
    case "drag":
      return Object.entries(primitive.answer)
        .map(([target, item]) => {
          const targetLabel = primitive.targets.find((entry) => entry.id === target)?.label ?? target;
          const itemLabel = primitive.items.find((entry) => entry.id === item)?.label ?? item;
          return `${targetLabel}: ${itemLabel}`;
        })
        .join("; ");
    case "balance":
      return primitive.answer;
    case "lever":
      return `${primitive.answer} m`;
    case "optics":
      return `${primitive.answer}°`;
    case "kinetics":
      return `${primitive.answer} M`;
    default: {
      const exhaustive: never = primitive;
      return exhaustive;
    }
  }
}

export function isAnswered(primitive: Primitive, response: PrimitiveResponse | null): boolean {
  if (response === null || response === undefined) return false;
  switch (primitive.kind) {
    case "toggle":
      return Array.isArray(response);
    case "choice":
      return typeof response === "string" && response.length > 0;
    case "slider":
      return typeof response === "number" && Number.isFinite(response);
    case "math":
      return typeof response === "string" && response.trim().length > 0;
    case "drag":
      return (
        typeof response === "object" &&
        !Array.isArray(response) &&
        response !== null &&
        Object.keys(response).length === primitive.targets.length
      );
    case "balance":
      return typeof response === "string" && response.trim().length > 0;
    case "lever":
      return typeof response === "number" && Number.isFinite(response);
    case "optics":
      return typeof response === "number" && Number.isFinite(response);
    case "kinetics":
      return typeof response === "number" && Number.isFinite(response);
    default:
      return false;
  }
}
