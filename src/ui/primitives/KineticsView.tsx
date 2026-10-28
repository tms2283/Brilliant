import type { KineticsPrimitive } from "../../schemas/primitive.js";

interface Props {
  primitive: KineticsPrimitive;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  showResult: boolean;
  correct: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Fixed pseudo-random offsets for molecule visual positions in the chamber
const PARTICLE_SEEDS = [
  { x: 50, y: 50 }, { x: 90, y: 110 }, { x: 130, y: 60 }, { x: 70, y: 150 },
  { x: 160, y: 120 }, { x: 110, y: 170 }, { x: 190, y: 80 }, { x: 210, y: 150 },
  { x: 240, y: 100 }, { x: 270, y: 160 }, { x: 290, y: 70 }, { x: 320, y: 130 },
  { x: 350, y: 90 }, { x: 380, y: 150 }, { x: 410, y: 80 }, { x: 440, y: 140 },
  { x: 140, y: 180 }, { x: 230, y: 50 }, { x: 330, y: 170 }, { x: 430, y: 60 },
];

export function KineticsView({ primitive, value, onChange, disabled, showResult, correct }: Props) {
  const currentRate = primitive.k * Math.pow(value, primitive.order);
  const delta = Math.abs(value - primitive.answer);
  const matches = delta <= primitive.tolerance;

  // Number of particles to display proportional to concentration
  const particleCount = Math.round((value / primitive.maxConcM) * PARTICLE_SEEDS.length);
  const visibleParticles = PARTICLE_SEEDS.slice(0, Math.max(2, particleCount));

  // Max rate for meter scale
  const maxPossibleRate = primitive.k * Math.pow(primitive.maxConcM, primitive.order);
  const ratePercent = Math.min(100, (currentRate / Math.max(maxPossibleRate, primitive.targetRateMPerS * 1.2)) * 100);
  const targetPercent = Math.min(100, (primitive.targetRateMPerS / Math.max(maxPossibleRate, primitive.targetRateMPerS * 1.2)) * 100);

  const nudge = (direction: -1 | 1) => {
    if (disabled) return;
    onChange(
      Number(
        clamp(value + direction * primitive.stepConcM, primitive.minConcM, primitive.maxConcM).toFixed(
          2,
        ),
      ),
    );
  };

  return (
    <div className={`kinetics-widget${showResult ? " is-locked" : ""}`}>
      <div className="kinetics-scene" role="img" aria-label={`Reaction chamber for reactant ${primitive.reactant}`}>
        <svg viewBox="0 0 500 220" className="kinetics-canvas" aria-hidden="true">
          <defs>
            <radialGradient id="particleGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </radialGradient>
            <linearGradient id="vesselGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Reaction Vessel */}
          <rect x="20" y="20" width="460" height="180" rx="12" fill="url(#vesselGrad)" stroke="#334155" strokeWidth="2" />

          {/* Grid lines inside vessel */}
          <line x1="20" y1="80" x2="480" y2="80" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="20" y1="140" x2="480" y2="140" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

          {/* Molecules */}
          {visibleParticles.map((pos, idx) => (
            <g key={idx}>
              <circle cx={pos.x} cy={pos.y} r="10" fill="url(#particleGrad)" opacity="0.9" />
              <text x={pos.x} y={pos.y + 4} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                {primitive.reactant}
              </text>
            </g>
          ))}

          {/* Target rate marker line overlay at bottom */}
          <rect x="30" y="185" width="440" height="8" rx="4" fill="#334155" />
          <rect x="30" y="185" width={`${(ratePercent / 100) * 440}`} height="8" rx="4" fill={matches ? "#10b981" : "#0284c7"} />
          <line
            x1={30 + (targetPercent / 100) * 440}
            y1="180"
            x2={30 + (targetPercent / 100) * 440}
            y2="198"
            stroke="#f59e0b"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="kinetics-readout" aria-live="polite">
        <div>
          <span className="kinetics-readout-label">Concentration [{primitive.reactant}]</span>
          <strong>{value.toFixed(2)} M</strong>
        </div>
        <div>
          <span className="kinetics-readout-label">Current Reaction Rate</span>
          <strong style={{ color: matches ? "#10b981" : undefined }}>
            {currentRate.toFixed(2)} M/s
          </strong>
        </div>
        <div>
          <span className="kinetics-readout-label">Target Rate</span>
          <strong style={{ color: "#f59e0b" }}>{primitive.targetRateMPerS.toFixed(2)} M/s</strong>
        </div>
        <div>
          <span className="kinetics-readout-label">Rate Law</span>
          <strong>
            Rate = k[{primitive.reactant}]{primitive.order > 1 ? `^${primitive.order}` : primitive.order === 0 ? "^0" : ""}
          </strong>
        </div>
      </div>

      <div className={`kinetics-status${matches ? " is-matched" : ""}`}>
        {matches
          ? `Target rate achieved! At [${primitive.reactant}] = ${value.toFixed(2)} M, the reaction progresses at ${currentRate.toFixed(2)} M/s.`
          : currentRate < primitive.targetRateMPerS
            ? "Reaction rate is too slow. Increase reactant concentration to produce more frequent collisions."
            : "Reaction rate is too fast. Decrease concentration to lower the collision frequency."}
      </div>

      <div className="kinetics-controls">
        <button
          type="button"
          className="icon-button"
          onClick={() => nudge(-1)}
          disabled={disabled || value <= primitive.minConcM}
          aria-label={`Decrease concentration by ${primitive.stepConcM} M`}
        >
          &larr;
        </button>
        <input
          type="range"
          min={primitive.minConcM}
          max={primitive.maxConcM}
          step={primitive.stepConcM}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(Number(Number(event.target.value).toFixed(2)))}
          aria-label={`Reactant concentration in M (current: ${value.toFixed(2)} M)`}
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => nudge(1)}
          disabled={disabled || value >= primitive.maxConcM}
          aria-label={`Increase concentration by ${primitive.stepConcM} M`}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
