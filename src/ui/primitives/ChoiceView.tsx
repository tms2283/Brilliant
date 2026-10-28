import type { ChoicePrimitive } from "../../schemas/primitive.js";

interface Props {
  primitive: ChoicePrimitive;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  showResult: boolean;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function ChoiceView({ primitive, value, onChange, disabled, showResult }: Props) {
  return (
    <div className="choice-grid" role="radiogroup" aria-label="Answer choices">
      {primitive.options.map((option, index) => {
        const chosen = value === option.id;
        const expected = primitive.answer === option.id;
        const resultClass = showResult
          ? expected
            ? " is-expected"
            : chosen
              ? " is-unexpected"
              : ""
          : "";
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={chosen}
            className={`choice-card${chosen ? " is-chosen" : ""}${resultClass}`}
            onClick={() => !disabled && onChange(option.id)}
            disabled={disabled}
          >
            <span className="choice-letter" aria-hidden="true">
              {LETTERS[index] ?? index + 1}
            </span>
            <span className="choice-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
