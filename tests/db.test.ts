import { afterEach, describe, expect, it } from "vitest";
import { closeDatabase, openDatabase, type Db } from "../src/db/index.js";

let db: Db | undefined;

afterEach(() => {
  if (db) closeDatabase(db);
  db = undefined;
});

describe("sqlite schema", () => {
  it("creates every core table", () => {
    db = openDatabase(":memory:");
    const rows = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
      .all() as { name: string }[];
    const names = rows.map((row) => row.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "attempt",
        "concept",
        "concept_edge",
        "concept_state",
        "course",
        "flag",
        "generator",
        "item",
        "lesson",
        "lesson_concept",
        "level",
        "meta",
        "path_plan",
        "settings",
      ]),
    );
  });

  it("keeps attempts append-only", () => {
    db = openDatabase(":memory:");
    db.prepare(
      `INSERT INTO attempt
       (id, item_id, lesson_id, concept_ids, phase, response, correct, first_attempt, hint_level, revealed, duration_ms, ts)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run("a1", "i1", "l1", "[]", "learn", "\"x\"", 1, 1, 0, 0, 100, new Date().toISOString());

    expect(() => db!.prepare("UPDATE attempt SET correct = 0 WHERE id = 'a1'").run()).toThrow(/append-only/);
    expect(() => db!.prepare("DELETE FROM attempt WHERE id = 'a1'").run()).toThrow(/append-only/);
  });

  it("rejects deleting content versions", () => {
    db = openDatabase(":memory:");
    db.prepare("INSERT INTO lesson (id, version, title, doc, status) VALUES (?, ?, ?, ?, ?)").run(
      "l1",
      "1.0.0",
      "Lesson",
      "{}",
      "active",
    );
    expect(() => db!.prepare("DELETE FROM lesson WHERE id = 'l1'").run()).toThrow(/immutable/);
  });
});
