import type { AppState, CourseTree } from "../db/repo.js";

interface Props {
  state: AppState;
  onExit: () => void;
  onSelectCourse: (courseId: string) => void;
  onSelectLesson: (lessonId: string) => void;
}

interface TrackDef {
  id: string;
  title: string;
  subject: string;
  description: string;
  courseIds: string[];
  levelLabel: string;
}

const TRACKS: TrackDef[] = [
  {
    id: "physics-track",
    title: "Physics & Physical Systems",
    subject: "Physics",
    levelLabel: "Core Track • 3 Courses",
    description:
      "Reason through forces, torques, electrical networks, and optical wave phenomena from first principles without memorising rote formulas.",
    courseIds: ["mechanics", "circuits", "optics"],
  },
  {
    id: "chemistry-track",
    title: "Chemical Kinetics & Dynamics",
    subject: "Chemistry",
    levelLabel: "Foundation • 1 Course",
    description:
      "Explore how collision dynamics, concentration, and temperature dictate the tempo of chemical reactions and exponential half-life decay.",
    courseIds: ["chemistry"],
  },
  {
    id: "math-track",
    title: "Algebraic Balance & Reasoning",
    subject: "Mathematics",
    levelLabel: "Foundation • 1 Course",
    description:
      "Treat algebra as a physical balance: maintain equality while symbols shift, isolating unknowns through balanced operations.",
    courseIds: ["balance"],
  },
  {
    id: "cs-logic-track",
    title: "Computer Science & Digital Logic",
    subject: "Computer Science",
    levelLabel: "Foundation • 1 Course",
    description:
      "Master the foundations of digital computation: Boolean algebra, truth tables, logic gates, and composite circuits.",
    courseIds: ["logic"],
  },
];

export function PathCatalogScreen({ state, onExit, onSelectCourse, onSelectLesson }: Props) {
  const courseMap = new Map<string, CourseTree>(state.courses.map((course) => [course.id, course]));

  return (
    <main id="main-content" className="catalog-screen">
      <div className="screen-header">
        <button type="button" className="text-button" onClick={onExit}>
          &larr; Back to Courses
        </button>
        <p className="eyebrow">Curated Learning Paths</p>
        <h1>The STEM Learning Tracks</h1>
        <p className="screen-lede">
          Ordered pedagogical journeys computed over the concept graph. Progress through each track at your own
          pace with mastery-adaptive sequencing.
        </p>
      </div>

      <div className="track-container">
        {TRACKS.map((track) => {
          const trackCourses = track.courseIds
            .map((id) => courseMap.get(id))
            .filter((c): c is CourseTree => c !== undefined);

          const totalLessons = trackCourses.reduce((sum, c) => sum + c.totalLessons, 0);
          const completedLessons = trackCourses.reduce((sum, c) => sum + c.completedLessons, 0);
          const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          // Find first uncompleted lesson in the track
          let nextLessonId: string | null = null;
          for (const course of trackCourses) {
            for (const level of course.levels) {
              for (const lesson of level.lessons) {
                if (!lesson.completedAt) {
                  nextLessonId = lesson.id;
                  break;
                }
              }
              if (nextLessonId) break;
            }
            if (nextLessonId) break;
          }

          return (
            <article key={track.id} className="track-card">
              <div className="track-header">
                <div>
                  <span className="track-subject-badge">{track.subject}</span>
                  <span className="track-level-badge">{track.levelLabel}</span>
                  <h2>{track.title}</h2>
                  <p className="track-description">{track.description}</p>
                </div>
                <div className="track-progress-box">
                  <div className="track-progress-number">{percent}%</div>
                  <div className="track-progress-meta">
                    {completedLessons}/{totalLessons} lessons
                  </div>
                </div>
              </div>

              <div className="track-courses-flow">
                {trackCourses.map((course, idx) => {
                  const isFinished = course.totalLessons > 0 && course.completedLessons === course.totalLessons;
                  return (
                    <div key={course.id} className="track-step">
                      <div className="step-connector" aria-hidden="true">
                        <span className={`step-circle${isFinished ? " is-complete" : ""}`}>
                          {isFinished ? "✓" : idx + 1}
                        </span>
                        {idx < trackCourses.length - 1 && <span className="step-line" />}
                      </div>
                      <div className="step-content">
                        <div className="step-title-row">
                          <h3>{course.title}</h3>
                          <span className="step-status">
                            {course.completedLessons}/{course.totalLessons} done
                          </span>
                        </div>
                        <p className="step-description">{course.description}</p>
                        <div className="step-actions">
                          <button
                            type="button"
                            className="button secondary mini"
                            onClick={() => onSelectCourse(course.id)}
                          >
                            View course path &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="track-footer">
                {nextLessonId ? (
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => onSelectLesson(nextLessonId!)}
                  >
                    Continue track &rarr;
                  </button>
                ) : (
                  <span className="track-complete-badge">Track Completed &bull; 100% Mastered</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
