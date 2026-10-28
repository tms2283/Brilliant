import { spawn } from "node:child_process";

const children = [];

function run(name, command, args) {
  const child = spawn(command, args, { stdio: "inherit", shell: true });
  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with ${code}`);
      shutdown(code ?? 1);
    }
  });
  children.push(child);
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("server", "npx", ["tsx", "watch", "src/server/index.ts"]);
run("web", "npx", ["vite"]);
