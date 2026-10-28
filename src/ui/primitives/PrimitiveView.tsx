import type { Primitive, PrimitiveResponse } from "../../schemas/primitive.js";
import { BalanceView } from "./BalanceView.js";
import { ChoiceView } from "./ChoiceView.js";
import { DragView } from "./DragView.js";
import { LeverView } from "./LeverView.js";
import { MathView } from "./MathView.js";
import { OpticsView } from "./OpticsView.js";
import { KineticsView } from "./KineticsView.js";
import { SliderView } from "./SliderView.js";
import { ToggleView } from "./ToggleView.js";

interface Props {
  primitive: Primitive;
  value: PrimitiveResponse;
  onChange: (value: PrimitiveResponse) => void;
  disabled?: boolean;
  showResult?: boolean;
  correct?: boolean;
}

export function PrimitiveView({
  primitive,
  value,
  onChange,
  disabled = false,
  showResult = false,
  correct = false,
}: Props) {
  switch (primitive.kind) {
    case "toggle":
      return (
        <ToggleView
          primitive={primitive}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          disabled={disabled}
          showResult={showResult}
          correct={correct}
        />
      );
    case "choice":
      return (
        <ChoiceView
          primitive={primitive}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          disabled={disabled}
          showResult={showResult}
        />
      );
    case "slider":
      return (
        <SliderView
          primitive={primitive}
          value={typeof value === "number" ? value : primitive.min}
          onChange={onChange}
          disabled={disabled}
          showResult={showResult}
        />
      );
    case "math":
      return (
        <MathView
          primitive={primitive}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          disabled={disabled}
          showResult={showResult}
        />
      );
    case "drag": {
      const record =
        typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
      return (
        <DragView
          primitive={primitive}
          value={record}
          onChange={onChange}
          disabled={disabled}
          showResult={showResult}
        />
      );
    }
    case "balance":
      return (
        <BalanceView
          primitive={primitive}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          disabled={disabled}
          showResult={showResult}
        />
      );
    case "lever":
      return (
        <LeverView
          primitive={primitive}
          value={typeof value === "number" ? value : primitive.right.minM}
          onChange={onChange}
          disabled={disabled}
          showResult={showResult}
          correct={correct}
        />
      );
    case "optics":
      return (
        <OpticsView
          primitive={primitive}
          value={typeof value === "number" ? value : primitive.minRefractedDeg}
          onChange={onChange}
          disabled={disabled}
          showResult={showResult}
          correct={correct}
        />
      );
    case "kinetics":
      return (
        <KineticsView
          primitive={primitive}
          value={typeof value === "number" ? value : primitive.minConcM}
          onChange={onChange}
          disabled={disabled}
          showResult={showResult}
          correct={correct}
        />
      );
    default: {
      const exhaustive: never = primitive;
      return exhaustive;
    }
  }
}
