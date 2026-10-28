import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type Db = Database.Database;

const SCHEMA = readFileSync(resolve(process.cwd(), "src/db/schema.sql"), "utf8");

export function openDatabase(path = "data/noesis.db"): Db {
  if (path !== ":memory:") {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  return db;
}

export function closeDatabase(db: Db): void {
  db.close();
}
