import { useEffect, useState } from "react";
import type { AppState } from "../app/api.js";
import { getPathPlan } from "../app/api.js";
import type { PathNode, PathPlan } from "../schemas/path.js";

interface PathScreenProps {
  courseId: string;
  state: AppState;
  onExit: () => void;
  onPractice: (generatorId: string, count: number) => void;
}

export function PathScreen({ courseId, state, onExit, onPractice }: PathScreenProps) {
  const [plan, setPlan] = useState<PathPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const course = state.courses.find((entry) => entry.id === courseId);

  useEffect(() => {
    let active = true;
    setPlan(null);
    setError(null);
    getPathPlan(courseId)
      .then((next) => {
        if (active) setPlan(next);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not build path");
      });
    return () => {
      active = false;
    };
  }, [courseId, state.stats.attempts, state.stats.completedLessons]);

  if (error) {
    return (
      <main className="path-shell">
        <button type="button" className="text-button" onClick={onExit}>
          ← Courses
        </button>
        <div className="state-panel">
          <p className="eyebrow">Path unavailable</p>
          <h1>{error}</h1>
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="path-shell">
        <button type="button" className="text-button" onClick={onExit}>
          ← Courses
        </button>
        <p className="muted">Building your path…</p>
      </main>
    );
  }

  const conceptTitle = (conceptId?: string) =>
    state.concepts.find((concept) => concept.id === conceptId)?.title ?? conceptId ?? "";

  function open(node: PathNode) {
    if (node.status === "locked") return;
    if (node.kind === "lesson" && node.lessonId) {
      window.location.hash = `/lesson/${encodeURIComponent(node.lessonId)}`;
      return;
    }
    if (node.conceptId) {
      const concept = state.concepts.find((entry) => entry.id === node.conceptId);
      const generatorId = concept?.generatorIds[0];
      if (generatorId) {
        onPractice(generatorId, 8);
        return;
      }
    }
    if (node.lessonId) window.location.hash = `/lesson/${encodeURIComponent(node.lessonId)}`;
  }

  return (
    <main id="main-content" className="path-shell">
      <button type="button" className="text-button" onClick={onExit}>
        ← All courses
      </button>
      <header className="path-header">
        <p className="eyebrow">{course?.domain ?? "Course"} path</p>
        <h1>{course?.title ?? courseId}</h1>
        <p className="hero-lede">{plan.goal}</p>
        <div className="path-legend">
          <span><i className="node-dot is-available" /> ready</span>
          <span><i className="node-dot is-completed" /> complete</span>
          <span><i className="node-dot is-mastered" /> mastered</span>
          <span><i className="node-dot is-locked" /> locked</span>
        </div>
      </header>

      <ol className="path-list">
        {plan.nodes.map((node) => {
          const label =
            node.kind === "review" || node.kind === "remediation"
              ? `${node.kind === "review" ? "Review" : "Rebuild"}: ${conceptTitle(node.conceptId)}`
              : node.label;
          return (
            <li key={node.id} className={`path-node is-${node.status} kind-${node.kind}`}>
              <button
                type="button"
                className="path-node-button"
                onClick={() => open(node)}
                disabled={node.status === "locked"}
              >
                <span className={`node-marker is-${node.status}`} aria-hidden="true">
                  {node.status === "mastered" ? "★" : node.status === "completed" ? "✓" : node.kind === "review" ? "↺" : ""}
                </span>
                <span className="node-copy">
                  <span className="node-kind">{node.kind}</span>
                  <strong>{label}</strong>
                  {node.reason ? <span className="node-reason">{node.reason}</span> : null}
                </span>
                <span className="node-status">{node.status === "locked" ? "Locked" : node.status === "available" ? "Open" : node.status}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="path-note">The path updates from your actual attempts, review schedule, and mastery evidence.</p>
    </main>
  );
}
