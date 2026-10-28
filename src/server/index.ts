import { existsSync } from "node:fs";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { openDatabase } from "../db/index.js";
import { seedContent } from "../db/repo.js";
import { CONCEPTS, CONCEPT_EDGES, COURSES, LESSONS } from "../content/index.js";
import { createApp } from "./app.js";

const db = openDatabase();
seedContent(db, { courses: COURSES, lessons: LESSONS, concepts: CONCEPTS, edges: CONCEPT_EDGES });

const app = createApp(db);

if (existsSync("./dist/index.html")) {
  app.use("/*", serveStatic({ root: "./dist" }));
  app.get("*", serveStatic({ path: "./dist/index.html" }));
}

const port = Number(process.env.PORT ?? 8787);

const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Noesis API on http://localhost:${info.port}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
