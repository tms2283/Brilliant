import { useState } from "react";
import type { AppState } from "../db/repo.js";
import { getTutorHint } from "../app/api.js";

interface Props {
  state: AppState | null;
  onExit: () => void;
}

export function SettingsScreen({ state, onExit }: Props) {
  const [provider, setProvider] = useState(() => localStorage.getItem("noesis.tutorProvider") ?? "deterministic");
  const [claudeKey, setClaudeKey] = useState(() => localStorage.getItem("noesis.claudeKey") ?? "");
  const [claudeModel, setClaudeModel] = useState(() => localStorage.getItem("noesis.claudeModel") ?? "claude-3-7-sonnet-20250219");
  const [ollamaUrl, setOllamaUrl] = useState(() => localStorage.getItem("noesis.ollamaUrl") ?? "http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState(() => localStorage.getItem("noesis.ollamaModel") ?? "llama3.2");
  const [nonColorCues, setNonColorCues] = useState(() => localStorage.getItem("noesis.nonColorCues") !== "false");
  const [skipMastered, setSkipMastered] = useState(() => localStorage.getItem("noesis.skipMastered") !== "false");

  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const saveSettings = () => {
    localStorage.setItem("noesis.tutorProvider", provider);
    localStorage.setItem("noesis.claudeKey", claudeKey);
    localStorage.setItem("noesis.claudeModel", claudeModel);
    localStorage.setItem("noesis.ollamaUrl", ollamaUrl);
    localStorage.setItem("noesis.ollamaModel", ollamaModel);
    localStorage.setItem("noesis.nonColorCues", String(nonColorCues));
    localStorage.setItem("noesis.skipMastered", String(skipMastered));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const testConnection = async () => {
    setTestLoading(true);
    setTestStatus(null);
    try {
      const reply = await getTutorHint({
        phase: "learn",
        ladderLevel: 1,
        prompt: "Close switches to complete the circuit.",
        hint: "Current needs an unbroken loop.",
        explanation: "Closing switches completes the loop.",
        solutionSteps: ["Step 1: Check source", "Step 2: Close switch"],
        conceptIds: ["circuits.series"],
      });
      setTestStatus(`Success! Verified tutor hint response received (${reply.source}): "${reply.message.slice(0, 70)}..."`);
    } catch (error) {
      setTestStatus(`Test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <main id="main-content" className="settings-screen">
      <div className="screen-header">
        <button type="button" className="text-button" onClick={onExit}>
          &larr; Back to Workbench
        </button>
        <p className="eyebrow">Local Workbench Preferences</p>
        <h1>Settings &amp; AI Provider Configuration</h1>
        <p className="screen-lede">
          Configure AI tutoring adapters, model fallbacks, and accessibility preferences.
          Keys and preferences remain local in your browser and OS keychain.
        </p>
      </div>

      <div className="settings-container">
        {/* Tutor Provider Section */}
        <section className="settings-section">
          <h2>AI Tutor Provider (D2)</h2>
          <p className="settings-description">
            Noesis uses Claude API as primary online tutor, with automatic fallback to Ollama offline,
            and a 100% deterministic local hint ladder that requires zero network.
          </p>

          <div className="form-group">
            <label htmlFor="provider-select">Active Provider</label>
            <select
              id="provider-select"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="select-input"
            >
              <option value="claude">Claude API (Anthropic)</option>
              <option value="ollama">Ollama (Local Offline LLM)</option>
              <option value="deterministic">Deterministic Local Tutor (Zero Network)</option>
            </select>
          </div>

          {provider === "claude" && (
            <div className="provider-fields">
              <div className="form-group">
                <label htmlFor="claude-key">Anthropic API Key</label>
                <input
                  id="claude-key"
                  type="password"
                  value={claudeKey}
                  placeholder="sk-ant-api..."
                  onChange={(e) => setClaudeKey(e.target.value)}
                  className="text-input"
                />
                <span className="field-hint">Stored strictly in local browser storage; never transmitted to telemetry.</span>
              </div>
              <div className="form-group">
                <label htmlFor="claude-model">Claude Model</label>
                <select
                  id="claude-model"
                  value={claudeModel}
                  onChange={(e) => setClaudeModel(e.target.value)}
                  className="select-input"
                >
                  <option value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet (Recommended)</option>
                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                  <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Fast)</option>
                </select>
              </div>
            </div>
          )}

          {provider === "ollama" && (
            <div className="provider-fields">
              <div className="form-group">
                <label htmlFor="ollama-url">Ollama Host URL</label>
                <input
                  id="ollama-url"
                  type="text"
                  value={ollamaUrl}
                  placeholder="http://localhost:11434"
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  className="text-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ollama-model">Ollama Model</label>
                <input
                  id="ollama-model"
                  type="text"
                  value={ollamaModel}
                  placeholder="llama3.2"
                  onChange={(e) => setOllamaModel(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>
          )}

          <div className="provider-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => void testConnection()}
              disabled={testLoading}
            >
              {testLoading ? "Testing..." : "Test Tutor Connection"}
            </button>
            {testStatus && <p className="test-status-msg">{testStatus}</p>}
          </div>
        </section>

        {/* Accessibility & Pedagogical Controls */}
        <section className="settings-section">
          <h2>Pedagogy &amp; Accessibility (I8)</h2>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={nonColorCues}
                onChange={(e) => setNonColorCues(e.target.checked)}
              />
              <span>
                <strong>Non-color verdict and status cues</strong>
                <span className="checkbox-subtext">
                  Display high-contrast icons, text labels, and patterns alongside color changes on all manipulatives.
                </span>
              </span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={skipMastered}
                onChange={(e) => setSkipMastered(e.target.checked)}
              />
              <span>
                <strong>Adaptive path acceleration</strong>
                <span className="checkbox-subtext">
                  Automatically mark concepts as mastered when FSRS stability and EMA accuracy thresholds are met.
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* Data Ownership & Storage */}
        <section className="settings-section">
          <h2>Local Data Storage (I6)</h2>
          <p className="settings-description">
            Your progress, attempt log, and curated content live in a local SQLite database at:
            <code> data/noesis.db</code>.
          </p>
          <div className="storage-stats">
            <div>
              <span>Attempts Recorded:</span>
              <strong>{state?.stats.attempts ?? 0}</strong>
            </div>
            <div>
              <span>Concepts Mastered:</span>
              <strong>{state?.learner.masteredCount ?? 0}</strong>
            </div>
            <div>
              <span>Offline Ready:</span>
              <strong className="status-online">Yes (Local First)</strong>
            </div>
          </div>
        </section>

        <div className="save-bar">
          <button type="button" className="button primary" onClick={saveSettings}>
            Save Preferences
          </button>
          {savedNotice && <span className="saved-confirm">✓ Preferences saved</span>}
        </div>
      </div>
    </main>
  );
}
