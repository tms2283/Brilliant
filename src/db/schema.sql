PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS concept (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  knowledge_points TEXT NOT NULL,
  generator_ids TEXT NOT NULL,
  provenance TEXT NOT NULL,
  confidence TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS concept_edge (
  from_id TEXT NOT NULL REFERENCES concept(id),
  to_id TEXT NOT NULL REFERENCES concept(id),
  type TEXT NOT NULL,
  weight REAL,
  provenance TEXT NOT NULL,
  confidence TEXT NOT NULL,
  PRIMARY KEY (from_id, to_id, type),
  CHECK (from_id <> to_id)
);

CREATE TABLE IF NOT EXISTS course (
  id TEXT NOT NULL,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  PRIMARY KEY (id, version)
);

CREATE TABLE IF NOT EXISTS level (
  course_id TEXT NOT NULL,
  course_version TEXT NOT NULL,
  id TEXT NOT NULL,
  title TEXT NOT NULL,
  ordinal INTEGER NOT NULL,
  PRIMARY KEY (course_id, course_version, id),
  FOREIGN KEY (course_id, course_version) REFERENCES course(id, version)
);

CREATE TABLE IF NOT EXISTS lesson (
  id TEXT NOT NULL,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  doc TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  PRIMARY KEY (id, version)
);

CREATE TABLE IF NOT EXISTS lesson_concept (
  lesson_id TEXT NOT NULL,
  lesson_version TEXT NOT NULL,
  concept_id TEXT NOT NULL REFERENCES concept(id),
  role TEXT NOT NULL,
  PRIMARY KEY (lesson_id, lesson_version, concept_id, role),
  FOREIGN KEY (lesson_id, lesson_version) REFERENCES lesson(id, version)
);

CREATE TABLE IF NOT EXISTS generator (
  id TEXT NOT NULL,
  version TEXT NOT NULL,
  domain TEXT NOT NULL,
  param_schema TEXT NOT NULL,
  radicals TEXT NOT NULL,
  misconception_rules TEXT NOT NULL,
  PRIMARY KEY (id, version)
);

CREATE TABLE IF NOT EXISTS item (
  id TEXT PRIMARY KEY,
  generator_id TEXT NOT NULL,
  generator_version TEXT NOT NULL,
  seed INTEGER NOT NULL,
  primitive TEXT NOT NULL,
  solution_steps TEXT NOT NULL,
  difficulty_d REAL NOT NULL,
  eval_report TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attempt (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  concept_ids TEXT NOT NULL,
  phase TEXT NOT NULL,
  response TEXT NOT NULL,
  correct INTEGER NOT NULL CHECK (correct IN (0, 1)),
  first_attempt INTEGER NOT NULL CHECK (first_attempt IN (0, 1)),
  hint_level INTEGER NOT NULL,
  revealed INTEGER NOT NULL CHECK (revealed IN (0, 1)),
  duration_ms INTEGER NOT NULL,
  ts TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS attempt_by_concept ON attempt(lesson_id, ts);
CREATE INDEX IF NOT EXISTS attempt_by_item ON attempt(item_id, ts);

CREATE TRIGGER IF NOT EXISTS attempt_no_update
BEFORE UPDATE ON attempt
BEGIN
  SELECT RAISE(ABORT, 'attempt is append-only');
END;

CREATE TRIGGER IF NOT EXISTS attempt_no_delete
BEFORE DELETE ON attempt
BEGIN
  SELECT RAISE(ABORT, 'attempt is append-only');
END;

CREATE TABLE IF NOT EXISTS concept_state (
  concept_id TEXT PRIMARY KEY REFERENCES concept(id),
  theta REAL NOT NULL,
  n_attempts INTEGER NOT NULL,
  ema REAL NOT NULL,
  mastery TEXT NOT NULL,
  fsrs_card TEXT,
  last_seen TEXT
);

CREATE TABLE IF NOT EXISTS path_plan (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  goal TEXT NOT NULL,
  nodes TEXT NOT NULL,
  generated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  lesson_id TEXT NOT NULL,
  lesson_version TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  check_correct INTEGER NOT NULL,
  check_total INTEGER NOT NULL,
  PRIMARY KEY (lesson_id, lesson_version)
);

CREATE TABLE IF NOT EXISTS flag (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  note TEXT,
  ts TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TRIGGER IF NOT EXISTS lesson_no_delete
BEFORE DELETE ON lesson
BEGIN
  SELECT RAISE(ABORT, 'content versions are immutable');
END;

CREATE TABLE IF NOT EXISTS topic_proposal (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  graph TEXT NOT NULL,
  critique TEXT NOT NULL,
  path TEXT NOT NULL,
  curator_status TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision >= 1),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS topic_proposal_by_updated ON topic_proposal(updated_at DESC);
