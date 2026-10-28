import { useState } from "react";
import type { AppState, CourseTree } from "../db/repo.js";

interface Props {
  state: AppState;
  onExit: () => void;
  onLaunchLesson: (lessonId: string) => void;
}

interface ArchivedRelease {
  version: string;
  releasedAt: string;
  notes: string;
  status: "active" | "archived" | "superseded";
}

const HISTORICAL_CHANGELOG: Record<string, ArchivedRelease[]> = {
  circuits: [
    {
      version: "1.0.0",
      releasedAt: "2026-10-20",
      notes: "Series/parallel circuits, Ohm's law, and electrical power with DC solver.",
      status: "active",
    },
    {
      version: "0.9.0",
      releasedAt: "2026-10-18",
      notes: "Initial prototype of series-parallel component toggle.",
      status: "archived",
    },
  ],
  balance: [
    {
      version: "1.0.0",
      releasedAt: "2026-10-20",
      notes: "Linear balance equations, equivalence, and balanced algebra operations.",
      status: "active",
    },
  ],
  mechanics: [
    {
      version: "1.0.0",
      releasedAt: "2026-10-21",
      notes: "Torque, beam balance, and mechanical advantage levers with statics solver.",
      status: "active",
    },
  ],
  optics: [
    {
      version: "1.0.0",
      releasedAt: "2026-10-21",
      notes: "Snell's law refraction ray simulator and thin lens imaging.",
      status: "active",
    },
  ],
  chemistry: [
    {
      version: "1.0.0",
      releasedAt: "2026-10-21",
      notes: "Chemical reaction rate laws, collision dynamics, and exponential half-life decay.",
      status: "active",
    },
  ],
};

export function ArchiveScreen({ state, onExit, onLaunchLesson }: Props) {
  const [filterDomain, setFilterDomain] = useState<string>("all");

  const exportAttempts = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.recentAttempts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `noesis-attempts-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredCourses =
    filterDomain === "all" ? state.courses : state.courses.filter((course) => course.domain === filterDomain);

  return (
    <main id="main-content" className="archive-screen">
      <div className="screen-header">
        <button type="button" className="text-button" onClick={onExit}>
          &larr; Back to Workbench
        </button>
        <p className="eyebrow">Content Versioning &amp; Immutable Archive</p>
        <h1>Never Lose a Course or Your Progress</h1>
        <p className="screen-lede">
          In commercial learning apps, courses are frequently retired without notice and mid-progress data is wiped.
          In Noesis, content versions are immutable, archived shelves remain perpetually playable, and your attempt history
          is append-only.
        </p>
      </div>

      <div className="archive-stats-row">
        <div className="stat">
          <span className="stat-value">{state.courses.length}</span>
          <span className="stat-label">Published Courses</span>
        </div>
        <div className="stat">
          <span className="stat-value">{state.courses.reduce((sum, c) => sum + c.totalLessons, 0)}</span>
          <span className="stat-label">Immutable Lessons</span>
        </div>
        <div className="stat">
          <span className="stat-value">{state.stats.attempts}</span>
          <span className="stat-label">Event Log Attempts</span>
        </div>
        <div className="stat">
          <button type="button" className="button secondary mini" onClick={exportAttempts}>
            Export Attempts (JSON) &darr;
          </button>
          <span className="stat-label">Full Data Ownership</span>
        </div>
      </div>

      <div className="archive-filter-bar">
        <span>Filter domain:</span>
        {["all", "circuits", "mechanics", "optics", "chemistry", "balance", "logic"].map((domain) => (
          <button
            key={domain}
            type="button"
            className={`filter-chip${filterDomain === domain ? " is-active" : ""}`}
            onClick={() => setFilterDomain(domain)}
          >
            {domain}
          </button>
        ))}
      </div>

      <div className="archive-grid">
        {filteredCourses.map((course) => {
          const releases = HISTORICAL_CHANGELOG[course.id] ?? [
            { version: "1.0.0", releasedAt: "2026-10-21", notes: "Active course version.", status: "active" },
          ];

          return (
            <article key={course.id} className="archive-course-card">
              <div className="archive-card-header">
                <div>
                  <span className="archive-domain-badge">{course.domain}</span>
                  <h3>{course.title}</h3>
                </div>
                <span className="archive-version-badge">v1.0.0</span>
              </div>
              <p className="archive-description">{course.description}</p>

              <div className="archive-lessons-list">
                <h4>Lessons in this release:</h4>
                <ul>
                  {course.levels.flatMap((lvl) => lvl.lessons).map((lesson) => (
                    <li key={lesson.id} className="archive-lesson-item">
                      <div>
                        <strong>{lesson.title}</strong>
                        <span className="archive-lesson-subtitle">{lesson.subtitle}</span>
                      </div>
                      <button
                        type="button"
                        className="button secondary mini"
                        onClick={() => onLaunchLesson(lesson.id)}
                      >
                        Launch v{lesson.version} &rarr;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="archive-changelog">
                <h4>Version History &amp; Migration Map:</h4>
                <ol className="changelog-list">
                  {releases.map((release) => (
                    <li key={release.version}>
                      <span className="release-tag">v{release.version} ({release.releasedAt})</span>
                      <span className={`release-status ${release.status}`}>{release.status}</span>
                      <p className="release-notes">{release.notes}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
