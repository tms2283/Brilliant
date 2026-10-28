import type { LeverPrimitive } from "../../schemas/primitive.js";

interface Props {
  primitive: LeverPrimitive;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  showResult: boolean;
  correct: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function format(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

export function LeverView({ primitive, value, onChange, disabled, showResult, correct }: Props) {
  const decimals = String(primitive.right.stepM).split(".")[1]?.length ?? 0;
  const leftTorque = primitive.left.forceN * primitive.left.distanceM;
  const rightTorque = primitive.right.forceN * value;
  const difference = rightTorque - leftTorque;
  const balanced = Math.abs(difference) <= primitive.right.forceN * primitive.tolerance;
  const scale = Math.max(primitive.left.distanceM, primitive.right.maxM, 1);
  const leftPosition = 50 - (primitive.left.distanceM / scale) * 42;
  const rightPosition = 50 + (value / scale) * 42;
  const tilt = balanced ? 0 : clamp((difference / Math.max(leftTorque, 1)) * 10, -9, 9);

  const nudge = (direction: -1 | 1) => {
    if (disabled) return;
    onChange(
      Number(
        clamp(value + direction * primitive.right.stepM, primitive.right.minM, primitive.right.maxM).toFixed(
          decimals,
        ),
      ),
    );
  };

  return (
    <div className={`lever-widget${showResult ? " is-locked" : ""}`}>
      <div className="lever-scene" role="img" aria-label={`Lever with a ${primitive.left.forceN} newton load`}>
        <div className="lever-frame">
          <div className="lever-beam" style={{ transform: `rotate(${tilt}deg)` }}>
            <div className="lever-load" style={{ left: `${leftPosition}%` }}>
              <span className="lever-weight">{primitive.left.forceN} N</span>
              <span className="lever-distance">{primitive.left.distanceM} m</span>
            </div>
            <div className="lever-effort" style={{ left: `${rightPosition}%` }}>
              <span className="lever-weight">{primitive.right.forceN} N</span>
              <span className="lever-distance">{format(value, decimals)} m</span>
            </div>
          </div>
          <div className="lever-pivot" aria-hidden="true" />
          <div className="lever-ground" aria-hidden="true" />
        </div>
      </div>

      <div className="lever-readout" aria-live="polite">
        <div>
          <span className="lever-readout-label">{primitive.left.label} torque</span>
          <strong>
            {primitive.left.forceN} N x {primitive.left.distanceM} m = {format(leftTorque, 2)} N m
          </strong>
        </div>
        <div>
          <span className="lever-readout-label">{primitive.right.label} torque</span>
          <strong>
            {primitive.right.forceN} N x {format(value, decimals)} m = {format(rightTorque, 2)} N m
          </strong>
        </div>
      </div>

      <div className={`lever-status${balanced ? " is-balanced" : ""}`}>
        {balanced
          ? "The torques match. The beam is balanced."
          : difference > 0
            ? "The effort torque is larger, so this side drops."
            : "The load torque is larger, so this side drops."}
      </div>

      <div className="lever-controls">
        <button
          type="button"
          className="icon-button"
          onClick={() => nudge(-1)}
          disabled={disabled || value <= primitive.right.minM}
          aria-label={`Move effort ${primitive.right.stepM} m toward the pivot`}
        >
          &larr;
        </button>
        <input
          type="range"
          min={primitive.right.minM}
          max={primitive.right.maxM}
          step={primitive.right.stepM}
          value={value}
          disabled={disabled}
          aria-label={`${primitive.right.label} distance from pivot`}
          aria-valuetext={`${format(value, decimals)} metres`}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => nudge(1)}
          disabled={disabled || value >= primitive.right.maxM}
          aria-label={`Move effort ${primitive.right.stepM} m away from the pivot`}
        >
          &rarr;
        </button>
      </div>

      <div className="lever-scale" aria-hidden="true">
        <span>{primitive.right.minM} m</span>
        <span>Pivot</span>
        <span>{primitive.right.maxM} m</span>
      </div>

      {showResult ? (
        <p className={`lever-result${correct ? " is-correct" : ""}`}>
          {correct
            ? "Balanced."
            : `Not balanced. Place the effort at ${primitive.answer} m from the pivot.`}
        </p>
      ) : null}
    </div>
  );
}
