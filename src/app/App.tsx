import { useCallback, useEffect, useState } from "react";
import {
  flushPendingAttempts,
  getLesson,
  getState,
  pendingAttemptCount,
  type AppState,
  type CourseTree,
  type LessonSummary,
} from "./api.js";
import { LessonScreen } from "../ui/LessonScreen.js";
import { PracticeScreen } from "../ui/PracticeScreen.js";
import { PathScreen } from "../ui/PathScreen.js";
import { ProgressScreen } from "../ui/ProgressScreen.js";
import { CustomTopicScreen } from "../ui/CustomTopicScreen.js";
import { CuratorScreen } from "../ui/CuratorScreen.js";
import { PathCatalogScreen } from "../ui/PathCatalogScreen.js";
import { ArchiveScreen } from "../ui/ArchiveScreen.js";
import { SettingsScreen } from "../ui/SettingsScreen.js";
import type { LessonDoc } from "../schemas/lesson.js";

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, "") || "/");
  useEffect(() => {
    const onChange = () => setRoute(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

function navigate(path: string) {
  window.location.hash = path;
}

export function App() {
  const route = useRoute();
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await flushPendingAttempts();
      setState(await getState());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not reach the local server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (route.startsWith("/path/") && state) {
    const courseId = decodeURIComponent(route.slice("/path/".length));
    return (
      <div className="app-shell">
        <SiteHeader stats={state.stats} route={route} />
        <PathScreen
          courseId={courseId}
          state={state}
          onExit={() => navigate("/")}
          onPractice={(generatorId, count) => navigate(`/practice/${encodeURIComponent(generatorId)}?count=${count}`)}
        />
        <Footer />
      </div>
    );
  }

  if (route === "/progress" && state) {
    return (
      <div className="app-shell">
        <SiteHeader stats={state.stats} route={route} />
        <ProgressScreen
          state={state}
          onExit={() => navigate("/")}
          onPractice={(generatorId, count) => navigate(`/practice/${encodeURIComponent(generatorId)}?count=${count}`)}
        />
        <Footer />
      </div>
    );
  }

  if (route === "/paths" && state) {
    return (
      <div className="app-shell">
        <SiteHeader stats={state.stats} route={route} />
        <PathCatalogScreen
          state={state}
          onExit={() => navigate("/")}
          onSelectCourse={(id) => navigate(`/path/${encodeURIComponent(id)}`)}
          onSelectLesson={(id) => navigate(`/lesson/${encodeURIComponent(id)}`)}
        />
        <Footer />
      </div>
    );
  }

  if (route === "/archive" && state) {
    return (
      <div className="app-shell">
        <SiteHeader stats={state.stats} route={route} />
        <ArchiveScreen
          state={state}
          onExit={() => navigate("/")}
          onLaunchLesson={(id) => navigate(`/lesson/${encodeURIComponent(id)}`)}
        />
        <Footer />
      </div>
    );
  }

  if (route === "/settings") {
    return (
      <div className="app-shell">
        <SiteHeader stats={state?.stats ?? null} route={route} />
        <SettingsScreen state={state} onExit={() => navigate("/")} />
        <Footer />
      </div>
    );
  }

  if (route === "/curator") {
    return (
      <div className="app-shell">
        <SiteHeader stats={state?.stats ?? null} route={route} />
        <CuratorScreen
          onExit={() => navigate("/")}
          onOpen={(id) => navigate(`/custom/${encodeURIComponent(id)}`)}
          onNew={() => navigate("/custom")}
        />
        <Footer />
      </div>
    );
  }

  if (route.startsWith("/custom/")) {
    return (
      <div className="app-shell">
        <SiteHeader stats={state?.stats ?? null} route={route} />
        <CustomTopicScreen
          proposalId={decodeURIComponent(route.slice("/custom/".length))}
          onExit={() => navigate("/curator")}
        />
        <Footer />
      </div>
    );
  }

  if (route === "/custom") {
    return (
      <div className="app-shell">
        <SiteHeader stats={state?.stats ?? null} route={route} />
        <CustomTopicScreen onExit={() => navigate("/")} />
        <Footer />
      </div>
    );
  }

  if (route.startsWith("/lesson/")) {
    const id = decodeURIComponent(route.slice("/lesson/".length));
    return (
      <LessonRoute
        id={id}
        onState={setState}
        onExit={() => navigate("/")}
        onPractice={(generatorId, count) => navigate(`/practice/${encodeURIComponent(generatorId)}?count=${count}`)}
      />
    );
  }

  if (route.startsWith("/practice/")) {
    const [path, query] = route.split("?");
    const generatorId = decodeURIComponent(path!.slice("/practice/".length));
    const count = Number(new URLSearchParams(query ?? "").get("count") ?? 12);
    return (
      <PracticeScreen
        generatorId={generatorId}
        count={Number.isFinite(count) ? count : 12}
        onState={setState}
        onExit={() => navigate("/")}
      />
    );
  }

  return (
    <div className="app-shell">
      <SiteHeader stats={state?.stats ?? null} route={route} />
      {loading ? (
        <LoadingPanel />
      ) : error ? (
        <ErrorPanel message={error} onRetry={() => void load()} />
      ) : state ? (
        <Home state={state} />
      ) : null}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>Noesis — local-first, account-free, offline-capable.</span>
      <span>{pendingAttemptCount() > 0 ? `${pendingAttemptCount()} attempt(s) waiting to sync` : "All attempts saved"}</span>
    </footer>
  );
}

function SiteHeader({ stats, route }: { stats: AppState["stats"] | null; route: string }) {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <button type="button" className="brand" onClick={() => navigate("/")}>
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
        </span>
        <span className="brand-name">Noesis</span>
      </button>
      <nav className="site-nav" aria-label="Main">
        <button type="button" className={`nav-link${route === "/" ? " is-active" : ""}`} onClick={() => navigate("/")}>
          Courses
        </button>
        <button
          type="button"
          className={`nav-link${route === "/paths" ? " is-active" : ""}`}
          onClick={() => navigate("/paths")}
        >
          Tracks
        </button>
        <button
          type="button"
          className={`nav-link${route === "/progress" ? " is-active" : ""}`}
          onClick={() => navigate("/progress")}
        >
          Progress
        </button>
        <button
          type="button"
          className={`nav-link${route === "/custom" || route.startsWith("/custom/") ? " is-active" : ""}`}
          onClick={() => navigate("/custom")}
        >
          Custom topic
        </button>
        <button
          type="button"
          className={`nav-link${route === "/curator" ? " is-active" : ""}`}
          onClick={() => navigate("/curator")}
        >
          Curator
        </button>
        <button
          type="button"
          className={`nav-link${route === "/archive" ? " is-active" : ""}`}
          onClick={() => navigate("/archive")}
        >
          Archive
        </button>
        <button
          type="button"
          className={`nav-link${route === "/settings" ? " is-active" : ""}`}
          onClick={() => navigate("/settings")}
        >
          Settings
        </button>
      </nav>
      <div className="header-stats" aria-label="Learner summary">
        <span>
          <strong>{stats?.streakDays ?? 0}</strong> day streak
        </span>
        <span>
          <strong>{stats ? Math.round(stats.accuracy * 100) : 0}%</strong> accuracy
        </span>
      </div>
    </header>
  );
}

function LoadingPanel() {
  return (
    <div className="state-panel">
      <p className="eyebrow">Opening the workbench</p>
      <h1>Loading your local state…</h1>
    </div>
  );
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state-panel">
      <p className="eyebrow">Server offline</p>
      <h1>The local API is not answering.</h1>
      <p className="muted">
        Start the app with <code>npm run dev</code>. If the server is running, retry. Attempts made while it is
        down are queued in this browser.
      </p>
      <p className="error-detail">{message}</p>
      <button type="button" className="button primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

function Home({ state }: { state: AppState }) {
  return (
    <main id="main-content" className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Interactive first principles</p>
          <h1>
            Learn by doing.
            <br />
            Prove it by doing.
          </h1>
          <p className="hero-lede">
            Move the system, watch the consequence, name the idea. Every lesson ends with a check you cannot
            click through.
          </p>
          <button type="button" className="button secondary hero-action" onClick={() => navigate("/custom")}>
            Build a custom topic →
          </button>
        </div>
        <div className="hero-panel" aria-label="How a lesson works">
          <ol className="loop-list">
            <li>
              <span>01</span>
              <div>
                <strong>Manipulate</strong>
                <p>Change a switch, a value, a side of the equation.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Observe</strong>
                <p>The app recomputes from the model, not from a script.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Explain</strong>
                <p>A concise idea connects the action to the consequence.</p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>Check</strong>
                <p>A fresh item tests transfer, not recall.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="stat-strip" aria-label="Progress">
        <Stat label="Attempts" value={String(state.stats.attempts)} />
        <Stat label="Lessons complete" value={String(state.stats.completedLessons)} />
        <Stat label="Concepts mastered" value={String(state.learner.masteredCount)} />
        <Stat label="Reviews due" value={String(state.learner.dueReviews)} />
      </section>

      <section className="course-section">
        <div className="section-heading">
          <p className="eyebrow">Courses</p>
          <h2>Choose a system to reason about.</h2>
        </div>
        <div className="course-grid">
          {state.courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="recent-section">
        <div className="section-heading">
          <p className="eyebrow">Recent attempts</p>
          <h2>The evidence so far.</h2>
        </div>
        {state.recentAttempts.length === 0 ? (
          <p className="muted">No attempts yet. Open Circuits and make a prediction.</p>
        ) : (
          <ul className="attempt-list">
            {state.recentAttempts.slice(0, 8).map((attempt) => (
              <li key={attempt.id}>
                <span className={`attempt-dot${attempt.correct ? " is-correct" : ""}`} aria-hidden="true" />
                <span className="attempt-lesson">{attempt.lessonId}</span>
                <span className="attempt-phase">{attempt.phase}</span>
                <span className="attempt-time">{new Date(attempt.ts).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function CourseCard({ course }: { course: CourseTree }) {
  const available = course.levels.some((level) => level.lessons.length > 0);
  return (
    <article className={`course-card${available ? "" : " is-draft"}`}>
      <div className="course-card-top">
        <span className="course-domain">{course.domain}</span>
        <span className="course-status">{course.status === "active" ? "Available" : "In build"}</span>
      </div>
      <h3>{course.title}</h3>
      <p className="course-description">{course.description}</p>
      <div className="course-progress">
        <span>
          {course.completedLessons}/{course.totalLessons} lessons
        </span>
        <span className="mini-track" aria-hidden="true">
          <span
            style={{
              width: `${course.totalLessons === 0 ? 0 : (course.completedLessons / course.totalLessons) * 100}%`,
            }}
          />
        </span>
      </div>
      {course.levels.map((level) => (
        <div key={level.id} className="level-block">
          <p className="level-title">{level.title}</p>
          {level.lessons.length === 0 ? (
            <p className="level-empty">Lessons in progress.</p>
          ) : (
            <ul className="lesson-list">
              {level.lessons.map((lesson, index) => (
                <LessonRow key={lesson.id} lesson={lesson} index={index} />
              ))}
            </ul>
          )}
        </div>
      ))}
      <button
        type="button"
        className="button secondary course-path-button"
        onClick={() => navigate(`/path/${course.id}`)}
      >
        Open {course.title} path →
      </button>
    </article>
  );
}

function LessonRow({ lesson, index }: { lesson: LessonSummary; index: number }) {
  const done = lesson.completedAt !== null;
  return (
    <li>
      <button type="button" className="lesson-row" onClick={() => navigate(`/lesson/${lesson.id}`)}>
        <span className={`lesson-index${done ? " is-done" : ""}`}>{done ? "✓" : String(index + 1).padStart(2, "0")}</span>
        <span className="lesson-row-copy">
          <strong>{lesson.title}</strong>
          <span>{lesson.subtitle}</span>
        </span>
        <span className="lesson-row-meta">
          {done
            ? `${lesson.checkCorrect}/${lesson.checkTotal} checks`
            : lesson.attempts > 0
              ? "In progress"
              : "Start"}
        </span>
      </button>
    </li>
  );
}

function LessonRoute({
  id,
  onExit,
  onState,
  onPractice,
}: {
  id: string;
  onExit: () => void;
  onState: (state: AppState) => void;
  onPractice: (generatorId: string, count: number) => void;
}) {
  const [lesson, setLesson] = useState<LessonDoc | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLesson(null);
    setError(null);
    getLesson(id)
      .then((doc) => {
        if (active) setLesson(doc);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load lesson");
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="state-panel">
        <p className="eyebrow">Lesson unavailable</p>
        <h1>{error}</h1>
        <button type="button" className="button primary" onClick={onExit}>
          Back to path
        </button>
      </div>
    );
  }
  if (!lesson) return <LoadingPanel />;
  return (
    <LessonScreen lesson={lesson} onExit={onExit} onState={onState} onPractice={onPractice} />
  );
}
