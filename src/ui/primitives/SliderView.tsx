import type { SliderPrimitive } from "../../schemas/primitive.js";

interface Props {
  primitive: SliderPrimitive;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  showResult: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function SliderView({ primitive, value, onChange, disabled, showResult }: Props) {
  const decimals = String(primitive.step).split(".")[1]?.length ?? 0;
  const format = (number: number) => number.toFixed(decimals);
  const nudge = (direction: -1 | 1) => {
    if (disabled) return;
    onChange(clamp(Number((value + direction * primitive.step).toFixed(decimals)), primitive.min, primitive.max));
  };

  return (
    <div className={`slider-widget${showResult ? " is-locked" : ""}`}>
      <div className="slider-readout" aria-live="polite">
        <span className="slider-number">{format(value)}</span>
        <span className="slider-unit">{primitive.unit}</span>
      </div>
      <div className="slider-row">
        <button
          type="button"
          className="icon-button"
          onClick={() => nudge(-1)}
          disabled={disabled || value <= primitive.min}
          aria-label={`Decrease by ${primitive.step}`}
        >
          −
        </button>
        <input
          type="range"
          min={primitive.min}
          max={primitive.max}
          step={primitive.step}
          value={value}
          disabled={disabled}
          aria-label={primitive.prompt}
          aria-valuetext={`${format(value)} ${primitive.unit}`}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => nudge(1)}
          disabled={disabled || value >= primitive.max}
          aria-label={`Increase by ${primitive.step}`}
        >
          +
        </button>
      </div>
      <div className="slider-scale" aria-hidden="true">
        <span>
          {primitive.min} {primitive.unit}
        </span>
        <span>
          {primitive.max} {primitive.unit}
        </span>
      </div>
    </div>
  );
}
