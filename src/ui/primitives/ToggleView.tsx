import type { TogglePrimitive } from "../../schemas/primitive.js";

interface Props {
  primitive: TogglePrimitive;
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
  showResult: boolean;
  correct: boolean;
}

export function ToggleView({ primitive, value, onChange, disabled, showResult, correct }: Props) {
  const toggle = (id: string) => {
    if (disabled) return;
    onChange(value.includes(id) ? value.filter((entry) => entry !== id) : [...value, id]);
  };

  return (
    <div className="toggle-grid" role="group" aria-label="Circuit switches">
      {primitive.components.map((component) => {
        const on = value.includes(component.id);
        const expected = primitive.answer.includes(component.id);
        const stateClass = showResult
          ? expected
            ? " is-expected"
            : on
              ? " is-unexpected"
              : ""
          : "";
        return (
          <button
            key={component.id}
            type="button"
            className={`switch-card${on ? " is-on" : ""}${stateClass}`}
            aria-pressed={on}
            aria-label={`${component.label}: ${on ? "closed" : "open"}`}
            onClick={() => toggle(component.id)}
            disabled={disabled}
          >
            <span className="switch-track" aria-hidden="true">
              <span className="switch-knob" />
            </span>
            <span className="switch-label">{component.label}</span>
            <span className="switch-state">{on ? "closed" : "open"}</span>
            {showResult && expected ? <span className="sr-only">Should be closed</span> : null}
            {showResult && !expected && on ? <span className="sr-only">Should be open</span> : null}
          </button>
        );
      })}
      {showResult && !correct ? (
        <p className="primitive-note">Green switches belong in the answer. Red switches should be open.</p>
      ) : null}
    </div>
  );
}
