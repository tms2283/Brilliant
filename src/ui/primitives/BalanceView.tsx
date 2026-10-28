import { useState } from "react";
import { applyOperation, createBalance, equationToString, isSolved, type BalanceState } from "../../domain/balance/engine.js";
import type { BalancePrimitive } from "../../schemas/primitive.js";
import { MathText } from "../MathText.js";

interface Props {
  primitive: BalancePrimitive;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  showResult: boolean;
}

export function BalanceView({ primitive, value, onChange, disabled, showResult }: Props) {
  const initial = () => createBalance(primitive.left, primitive.right, primitive.variable);
  const [history, setHistory] = useState<BalanceState[]>(() => [initial()]);
  const current = history[history.length - 1]!;
  const solved = isSolved(current);
  const equation = equationToString(current);

  const apply = (operationId: string) => {
    if (disabled) return;
    const operation = primitive.operations.find((entry) => entry.id === operationId);
    if (!operation) return;
    const next = applyOperation(current, operation);
    const nextHistory = [...history, next];
    setHistory(nextHistory);
    onChange(isSolved(next) ? equationToString(next) : "");
  };

  const undo = () => {
    if (disabled || history.length <= 1) return;
    const nextHistory = history.slice(0, -1);
    setHistory(nextHistory);
    const previous = nextHistory[nextHistory.length - 1]!;
    onChange(isSolved(previous) ? equationToString(previous) : "");
  };

  const reset = () => {
    if (disabled) return;
    setHistory([initial()]);
    onChange("");
  };

  return (
    <div className={`balance-widget${showResult ? " is-locked" : ""}`}>
      <div className="balance-scale" aria-label="Balance scale">
        <div className="balance-beam" />
        <div className="balance-pan">
          <span className="balance-pan-label">Left</span>
          <span className="balance-pan-expression">
            <MathText>{equation.split("=")[0]!.trim()}</MathText>
          </span>
        </div>
        <div className="balance-pivot" aria-hidden="true" />
        <div className="balance-pan">
          <span className="balance-pan-label">Right</span>
          <span className="balance-pan-expression">
            <MathText>{equation.split("=")[1]!.trim()}</MathText>
          </span>
        </div>
      </div>

      <div className="balance-equation" aria-live="polite">
        <MathText display>{equation}</MathText>
      </div>

      <p className={`balance-status${solved ? " is-solved" : ""}`}>
        {solved ? "The variable is isolated. Submit it." : "Any move must be applied to both sides."}
      </p>

      <div
        className="balance-dropzone"
        onDragOver={(event) => {
          if (!disabled) event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          const operationId = event.dataTransfer.getData("text/plain");
          if (operationId) apply(operationId);
        }}
      >
        <span className="dropzone-label">Drag an operation here, or click it</span>
        <div className="operation-row">
          {primitive.operations.map((operation) => (
            <button
              key={operation.id}
              type="button"
              className="operation-chip"
              draggable={!disabled}
              disabled={disabled}
              onClick={() => apply(operation.id)}
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", operation.id);
                event.dataTransfer.effectAllowed = "move";
              }}
            >
              {operation.label}
            </button>
          ))}
        </div>
      </div>

      <div className="balance-actions">
        <button type="button" className="button ghost small" onClick={undo} disabled={disabled || history.length <= 1}>
          Undo
        </button>
        <button type="button" className="button ghost small" onClick={reset} disabled={disabled || history.length <= 1}>
          Reset
        </button>
        <span className="balance-response" aria-live="polite">
          {value ? `Ready: ${value}` : "Not isolated yet"}
        </span>
      </div>
    </div>
  );
}
