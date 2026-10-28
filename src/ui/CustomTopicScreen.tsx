import { useEffect, useMemo, useState } from "react";
import { getTopicProposal, proposeTopic, reviseTopicGraph } from "../app/api.js";
import type { ConceptEdge } from "../schemas/concept.js";
import type { TopicGraph, TopicProposal } from "../schemas/topic.js";

interface CustomTopicScreenProps {
  proposalId?: string;
  onExit: () => void;
}

const SUGGESTIONS = ["Ohm's law and power", "Series and parallel circuits", "Solve linear equations"];

function edgeKey(edge: ConceptEdge): string {
  return `${edge.from}->${edge.to}:${edge.type}`;
}

export function CustomTopicScreen({ proposalId, onExit }: CustomTopicScreenProps) {
  const [topic, setTopic] = useState("");
  const [proposal, setProposal] = useState<TopicProposal | null>(null);
  const [draft, setDraft] = useState<TopicGraph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");

  useEffect(() => {
    if (!proposalId) return;
    let active = true;
    setLoading(true);
    getTopicProposal(proposalId)
      .then((loaded) => {
        if (!active) return;
        setProposal(loaded);
        setDraft(loaded.graph);
        setTopic(loaded.graph.topic);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load proposal");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [proposalId]);

  const dirty = useMemo(
    () => Boolean(proposal && draft && JSON.stringify(proposal.graph) !== JSON.stringify(draft)),
    [proposal, draft],
  );

  async function submit(nextTopic = topic) {
    const value = nextTopic.trim();
    if (value.length < 2 || loading) return;
    setTopic(value);
    setLoading(true);
    setError(null);
    setProposal(null);
    setDraft(null);
    try {
      const created = await proposeTopic(value);
      setProposal(created);
      setDraft(created.graph);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not build a topic proposal");
    } finally {
      setLoading(false);
    }
  }

  function removeNode(nodeId: string) {
    setDraft((current) => {
      if (!current) return current;
      return {
        ...current,
        nodes: current.nodes.filter((node) => node.id !== nodeId),
        edges: current.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId),
      };
    });
  }

  function removeEdge(edge: ConceptEdge) {
    setDraft((current) => {
      if (!current) return current;
      return { ...current, edges: current.edges.filter((entry) => edgeKey(entry) !== edgeKey(edge)) };
    });
  }

  function addEdge() {
    if (!draft || !edgeFrom || !edgeTo || edgeFrom === edgeTo) return;
    const duplicate = draft.edges.some(
      (edge) => edge.from === edgeFrom && edge.to === edgeTo && edge.type === "prerequisite",
    );
    if (duplicate) return;
    const edge: ConceptEdge = {
      from: edgeFrom,
      to: edgeTo,
      type: "prerequisite",
      provenance: "user",
      confidence: "low",
    };
    setDraft({ ...draft, edges: [...draft.edges, edge] });
    setEdgeFrom("");
    setEdgeTo("");
  }

  async function saveRevision() {
    if (!proposal || !draft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const revised = await reviseTopicGraph(proposal.id, draft);
      setProposal(revised);
      setDraft(revised.graph);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the graph revision");
    } finally {
      setSaving(false);
    }
  }

  const firstLesson = proposal?.path.nodes[0];

  return (
    <main className="custom-shell">
      <button type="button" className="text-button" onClick={onExit}>
        ← Courses
      </button>
      <header className="custom-header">
        <p className="eyebrow">Custom topic</p>
        <h1>Ask for a direction.</h1>
        <p className="hero-lede">
          The planner only proposes from authored, verified content. It will not invent a lesson to fill a gap.
        </p>
      </header>

      {!proposalId ? (
        <form
          className="custom-form"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <label htmlFor="topic-input">What do you want to understand?</label>
          <div className="custom-input-row">
            <input
              id="topic-input"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. voltage, current, and resistance"
              autoComplete="off"
            />
            <button type="submit" className="button primary" disabled={loading || topic.trim().length < 2}>
              {loading ? "Checking…" : "Propose path"}
            </button>
          </div>
          <div className="suggestion-row">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="operation-chip"
                onClick={() => void submit(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      ) : null}

      {error ? (
        <div className="custom-error">
          <p className="eyebrow">Proposal blocked</p>
          <p>{error}</p>
        </div>
      ) : null}

      {loading && proposalId ? <p className="muted">Loading proposal…</p> : null}

      {proposal && draft ? (
        <section className="proposal">
          <div className="proposal-head">
            <div>
              <p className="eyebrow">{proposal.graph.domain} proposal · revision {proposal.revision}</p>
              <h2>{proposal.graph.topic}</h2>
              <p className="muted">
                {draft.nodes.length} concepts · {proposal.path.nodes.length} lessons ·{" "}
                <span
                  className={`mastery-badge is-${
                    proposal.curatorStatus === "approved"
                      ? "mastered"
                      : proposal.curatorStatus === "rejected"
                        ? "rejected"
                        : "provisional"
                  }`}
                >
                  {proposal.curatorStatus}
                </span>
                {dirty ? <span className="dirty-note"> · unsaved edits</span> : null}
              </p>
            </div>
            <div className="proposal-actions">
              <button type="button" className="button secondary" disabled={!dirty || saving} onClick={() => void saveRevision()}>
                {saving ? "Saving…" : "Save revision"}
              </button>
              <button
                type="button"
                className="button primary"
                disabled={proposal.curatorStatus === "rejected" || !firstLesson}
                onClick={() => {
                  if (firstLesson?.lessonId) window.location.hash = `/lesson/${encodeURIComponent(firstLesson.lessonId)}`;
                }}
              >
                Start first lesson
              </button>
            </div>
          </div>

          <div className="proposal-grid">
            <div>
              <h3>Concept order</h3>
              <ol className="proposal-concepts">
                {proposal.critique.order.map((id, index) => {
                  const node = draft.nodes.find((entry) => entry.id === id);
                  if (!node) return null;
                  return (
                    <li key={id}>
                      <span className="lesson-index">{String(index + 1).padStart(2, "0")}</span>
                      <div className="proposal-concept-copy">
                        <strong>{node.title}</strong>
                        <p>{node.knowledgePoints[0]}</p>
                      </div>
                      <button
                        type="button"
                        className="edge-remove"
                        aria-label={`Remove ${node.title}`}
                        onClick={() => removeNode(node.id)}
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p className="muted editor-note">
                The order is derived from prerequisite edges. Remove a concept or change its edges, then save to re-run the
                critics.
              </p>
            </div>
            <div>
              <h3>Lesson sequence</h3>
              {proposal.path.nodes.length === 0 ? (
                <p className="muted">No path until the critics pass.</p>
              ) : (
                <ol className="proposal-lessons">
                  {proposal.path.nodes.map((node) => (
                    <li key={node.id}>
                      <button
                        type="button"
                        className="lesson-row"
                        onClick={() => {
                          if (node.lessonId) window.location.hash = `/lesson/${encodeURIComponent(node.lessonId)}`;
                        }}
                      >
                        <span className="lesson-row-copy">
                          <strong>{node.label}</strong>
                          <span>{node.reason}</span>
                        </span>
                        <span className="lesson-row-meta">Open</span>
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          <div className="graph-editor">
            <h3>Prerequisite edges</h3>
            <ul className="edge-list">
              {draft.edges
                .filter((edge) => edge.type === "prerequisite")
                .map((edge) => {
                  const from = draft.nodes.find((node) => node.id === edge.from)?.title ?? edge.from;
                  const to = draft.nodes.find((node) => node.id === edge.to)?.title ?? edge.to;
                  return (
                    <li key={edgeKey(edge)}>
                      <span>
                        {from} <span aria-hidden="true">→</span> {to}
                      </span>
                      <button type="button" className="edge-remove" onClick={() => removeEdge(edge)}>
                        Remove
                      </button>
                    </li>
                  );
                })}
            </ul>
            <div className="edge-form">
              <label>
                <span>Prerequisite</span>
                <select value={edgeFrom} onChange={(event) => setEdgeFrom(event.target.value)}>
                  <option value="">Choose a concept</option>
                  {draft.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Unlocks</span>
                <select value={edgeTo} onChange={(event) => setEdgeTo(event.target.value)}>
                  <option value="">Choose a concept</option>
                  {draft.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.title}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="button secondary" disabled={!edgeFrom || !edgeTo} onClick={addEdge}>
                Add edge
              </button>
            </div>
          </div>

          <div className="proposal-findings">
            <h3>Critic findings</h3>
            {proposal.critique.findings.length === 0 ? (
              <p className="muted">No warnings. Every concept has authored lessons and a verified generator.</p>
            ) : (
              <ul>
                {proposal.critique.findings.map((finding) => (
                  <li key={`${finding.code}-${finding.message}`} className={`finding is-${finding.severity}`}>
                    <strong>{finding.severity}</strong> {finding.message}
                  </li>
                ))}
              </ul>
            )}
            {dirty ? <p className="muted editor-note">Save the revision to re-run the critics and rebuild the path.</p> : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
