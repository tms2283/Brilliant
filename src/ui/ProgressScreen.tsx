import type { AppState } from "../app/api.js";
import { isDue } from "../domain/learner/model.js";

interface ProgressScreenProps {
  state: AppState;
  onExit: () => void;
  onPractice: (generatorId: string, count: number) => void;
}

export function ProgressScreen({ state, onExit, onPractice }: ProgressScreenProps) {
  const now = new Date();
  const states = new Map(state.learner.concepts.map((concept) => [concept.conceptId, concept]));

  return (
    <main id="main-content" className="progress-shell">
      <button type="button" className="text-button" onClick={onExit}>
        ← Courses
      </button>
      <header className="progress-header">
        <p className="eyebrow">Learner model</p>
        <h1>Evidence, not vibes.</h1>
        <p className="hero-lede">
          Mastery is estimated from your first attempts, accuracy, and spaced review. Nothing here is a
          permanent label.
        </p>
      </header>

      <section className="stat-strip progress-stats" aria-label="Learner summary">
        <div className="stat">
          <span className="stat-value">{state.learner.masteredCount}</span>
          <span className="stat-label">Concepts mastered</span>
        </div>
        <div className="stat">
          <span className="stat-value">{state.learner.provisionalCount}</span>
          <span className="stat-label">Provisional</span>
        </div>
        <div className="stat">
          <span className="stat-value">{state.learner.dueReviews}</span>
          <span className="stat-label">Reviews due</span>
        </div>
        <div className="stat">
          <span className="stat-value">{Math.round(state.stats.accuracy * 100)}%</span>
          <span className="stat-label">Overall accuracy</span>
        </div>
      </section>

      <section className="mastery-section">
        <div className="section-heading">
          <p className="eyebrow">Concept map</p>
          <h2>What the model currently believes.</h2>
        </div>
        <div className="mastery-list">
          {state.concepts.map((concept) => {
            const model = states.get(concept.id);
            const mastery = model?.mastery ?? "none";
            const due = model ? isDue(model, now) : false;
            const generatorId = concept.generatorIds[0];
            const ability = model ? Math.round((1 / (1 + Math.exp(-model.theta))) * 100) : 0;
            return (
              <article key={concept.id} className={`mastery-row is-${mastery}`}>
                <div className="mastery-copy">
                  <span className="course-domain">{concept.domain}</span>
                  <h3>{concept.title}</h3>
                  <p>{model ? `${model.nAttempts} attempts · ${Math.round(model.ema * 100)}% recent accuracy` : "No evidence yet"}</p>
                </div>
                <div className="mastery-meter" aria-label={`${concept.title} estimated ability ${ability}%`}>
                  <span style={{ width: `${ability}%` }} />
                </div>
                <span className={`mastery-badge is-${mastery}`}>
                  {due ? "review due" : mastery === "none" ? "not started" : mastery}
                </span>
                {generatorId ? (
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => onPractice(generatorId, 6)}
                  >
                    {mastery === "none" ? "Try it" : "Practice"}
                  </button>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
