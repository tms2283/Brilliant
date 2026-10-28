import { useEffect, useState } from "react";
import { listTopics } from "../app/api.js";
import type { TopicProposalSummary } from "../schemas/topic.js";

interface CuratorScreenProps {
  onExit: () => void;
  onOpen: (id: string) => void;
  onNew: () => void;
}

export function CuratorScreen({ onExit, onOpen, onNew }: CuratorScreenProps) {
  const [items, setItems] = useState<TopicProposalSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listTopics()
      .then((proposals) => {
        if (active) setItems(proposals);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load the curator queue");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="custom-shell">
      <button type="button" className="text-button" onClick={onExit}>
        ← Courses
      </button>
      <header className="custom-header">
        <p className="eyebrow">Curator queue</p>
        <h1>Proposals awaiting a decision.</h1>
        <p className="hero-lede">
          Every custom topic is a draft graph. Only approved graphs can produce a path; rejected graphs stay editable.
        </p>
        <button type="button" className="button primary queue-new" onClick={onNew}>
          New topic
        </button>
      </header>

      {loading ? <p className="muted">Loading proposals…</p> : null}
      {error ? <div className="custom-error">{error}</div> : null}
      {!loading && !error && items.length === 0 ? (
        <p className="muted">No proposals yet. Ask for a topic and the planner will add one here.</p>
      ) : null}

      <ul className="queue-list">
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className="queue-row" onClick={() => onOpen(item.id)}>
              <span className="queue-copy">
                <strong>{item.topic}</strong>
                <span>
                  revision {item.revision} · updated {new Date(item.updatedAt).toLocaleString()}
                </span>
              </span>
              <span
                className={`mastery-badge is-${
                  item.curatorStatus === "approved"
                    ? "mastered"
                    : item.curatorStatus === "rejected"
                      ? "rejected"
                      : "provisional"
                }`}
              >
                {item.curatorStatus}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
