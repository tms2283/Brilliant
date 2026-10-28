import katex from "katex";
import { useMemo, useRef } from "react";
import type { MathPrimitive } from "../../schemas/primitive.js";
import { previewMath } from "../../domain/evaluate.js";

interface Props {
  primitive: MathPrimitive;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  showResult: boolean;
}

const SYMBOLS = ["+", "−", "×", "÷", "^", "(", ")", "=", "√", "π"];

export function MathView({ primitive, value, onChange, disabled, showResult }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (value.trim() ? previewMath(value) : null), [value]);

  const insert = (symbol: string) => {
    if (disabled) return;
    onChange(`${value}${symbol}`);
    inputRef.current?.focus();
  };

  return (
    <div className={`math-widget${showResult ? " is-locked" : ""}`}>
      <input
        ref={inputRef}
        type="text"
        className="math-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Type an expression, e.g. 12/6"
        aria-label={primitive.prompt}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        inputMode="text"
      />
      {primitive.variables.length > 0 ? (
        <p className="math-variables">Variables: {primitive.variables.join(", ")}</p>
      ) : null}
      <div className="math-preview" aria-live="polite" aria-label="Expression preview">
        {preview ? (
          <span
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(value, { throwOnError: false, displayMode: true }),
            }}
          />
        ) : (
          <span className="muted">{value.trim() ? "Check the expression" : "Preview appears here"}</span>
        )}
      </div>
      <div className="symbol-row" aria-label="Insert symbol">
        {SYMBOLS.map((symbol) => (
          <button
            key={symbol}
            type="button"
            className="symbol-button"
            onClick={() => insert(symbol)}
            disabled={disabled}
            aria-label={`Insert ${symbol}`}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
