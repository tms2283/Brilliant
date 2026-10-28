import type { OpticsPrimitive } from "../../schemas/primitive.js";

interface Props {
  primitive: OpticsPrimitive;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  showResult: boolean;
  correct: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function OpticsView({ primitive, value, onChange, disabled, showResult, correct }: Props) {
  const theta1Rad = (primitive.incidentAngleDeg * Math.PI) / 180;
  const theta2Rad = (value * Math.PI) / 180;

  // Snell's Law calculated expected angle
  const sinTheta2 = (primitive.n1 / primitive.n2) * Math.sin(theta1Rad);
  const snellAngleDeg = sinTheta2 <= 1 ? (Math.asin(sinTheta2) * 180) / Math.PI : null;

  const delta = Math.abs(value - primitive.answer);
  const aligned = delta <= primitive.tolerance;

  // Ray geometry: center interface is at (250, 140)
  const cx = 250;
  const cy = 140;
  const rayLen = 120;

  // Incident ray comes from top-left into center
  const incX = cx - rayLen * Math.sin(theta1Rad);
  const incY = cy - rayLen * Math.cos(theta1Rad);

  // Refracted ray goes into medium 2 (down-right)
  const refX = cx + rayLen * Math.sin(theta2Rad);
  const refY = cy + rayLen * Math.cos(theta2Rad);

  const nudge = (direction: -1 | 1) => {
    if (disabled) return;
    onChange(
      Number(
        clamp(value + direction * primitive.stepDeg, primitive.minRefractedDeg, primitive.maxRefractedDeg).toFixed(
          1,
        ),
      ),
    );
  };

  return (
    <div className={`optics-widget${showResult ? " is-locked" : ""}`}>
      <div className="optics-scene" role="img" aria-label={`Refraction simulation from ${primitive.medium1} to ${primitive.medium2}`}>
        <svg viewBox="0 0 500 280" className="optics-canvas" aria-hidden="true">
          <defs>
            <linearGradient id="medium1Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="medium2Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.45" />
            </linearGradient>
            <marker id="rayArrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Medium 1 (top) */}
          <rect x="0" y="0" width="500" height="140" fill="url(#medium1Grad)" />
          <text x="20" y="30" fill="#94a3b8" fontSize="13" fontWeight="600">
            {primitive.medium1} (n = {primitive.n1.toFixed(2)})
          </text>

          {/* Medium 2 (bottom) */}
          <rect x="0" y="140" width="500" height="140" fill="url(#medium2Grad)" />
          <text x="20" y="170" fill="#38bdf8" fontSize="13" fontWeight="600">
            {primitive.medium2} (n = {primitive.n2.toFixed(2)})
          </text>

          {/* Boundary line */}
          <line x1="0" y1="140" x2="500" y2="140" stroke="#475569" strokeWidth="2" strokeDasharray="6 3" />

          {/* Normal line */}
          <line x1={cx} y1="20" x2={cx} y2="260" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x={cx + 6} y="35" fill="#64748b" fontSize="11">
            Normal
          </text>

          {/* Incident ray */}
          <line
            x1={incX}
            y1={incY}
            x2={cx}
            y2={cy}
            stroke="#fbbf24"
            strokeWidth="3"
            markerMid="url(#rayArrow)"
          />
          <circle cx={incX} cy={incY} r="5" fill="#f59e0b" />
          <text x={incX - 30} y={incY - 10} fill="#fbbf24" fontSize="12" fontWeight="600">
            Ray ({primitive.incidentAngleDeg}°)
          </text>

          {/* Refracted ray */}
          <line
            x1={cx}
            y1={cy}
            x2={refX}
            y2={refY}
            stroke="#38bdf8"
            strokeWidth="3"
          />
          <circle cx={refX} cy={refY} r="5" fill="#0284c7" />

          {/* Incident angle arc */}
          <path
            d={`M ${cx} ${cy - 35} A 35 35 0 0 0 ${cx - 35 * Math.sin(theta1Rad)} ${cy - 35 * Math.cos(theta1Rad)}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <text x={cx - 40} y={cy - 12} fill="#fbbf24" fontSize="11" fontWeight="bold">
            θ₁ = {primitive.incidentAngleDeg}°
          </text>

          {/* Refracted angle arc */}
          <path
            d={`M ${cx} ${cy + 35} A 35 35 0 0 0 ${cx + 35 * Math.sin(theta2Rad)} ${cy + 35 * Math.cos(theta2Rad)}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text x={cx + 20} y={cy + 30} fill="#38bdf8" fontSize="11" fontWeight="bold">
            θ₂ = {value.toFixed(1)}°
          </text>
        </svg>
      </div>

      <div className="optics-readout" aria-live="polite">
        <div>
          <span className="optics-readout-label">Incident angle (θ₁)</span>
          <strong>{primitive.incidentAngleDeg}°</strong>
        </div>
        <div>
          <span className="optics-readout-label">Refracted angle (θ₂)</span>
          <strong>{value.toFixed(1)}°</strong>
        </div>
        <div>
          <span className="optics-readout-label">Refractive indices</span>
          <strong>
            n₁ = {primitive.n1} → n₂ = {primitive.n2}
          </strong>
        </div>
      </div>

      <div className={`optics-status${aligned ? " is-aligned" : ""}`}>
        {aligned
          ? "The ray aligns with Snell's law: n₁ sin(θ₁) = n₂ sin(θ₂)."
          : primitive.n2 > primitive.n1
            ? "Entering a denser medium slows light down, bending it toward the normal (smaller angle)."
            : "Entering a less dense medium speeds light up, bending it away from the normal."}
      </div>

      <div className="optics-controls">
        <button
          type="button"
          className="icon-button"
          onClick={() => nudge(-1)}
          disabled={disabled || value <= primitive.minRefractedDeg}
          aria-label={`Decrease refracted angle by ${primitive.stepDeg}°`}
        >
          &larr;
        </button>
        <input
          type="range"
          min={primitive.minRefractedDeg}
          max={primitive.maxRefractedDeg}
          step={primitive.stepDeg}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(Number(Number(event.target.value).toFixed(1)))}
          aria-label={`Angle of refraction in degrees (current: ${value.toFixed(1)}°)`}
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => nudge(1)}
          disabled={disabled || value >= primitive.maxRefractedDeg}
          aria-label={`Increase refracted angle by ${primitive.stepDeg}°`}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
