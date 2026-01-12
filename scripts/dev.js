const { spawn } = require("node:child_process");

const commands = [
  {
    name: "web",
    cmd: "npm",
    args: ["--workspace", "apps/web", "run", "dev"],
  },
  {
    name: "api",
    cmd: "npm",
    args: ["--workspace", "apps/api", "run", "dev"],
  },
];

const children = commands.map(({ cmd, args }) =>
  spawn(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  })
);

const shutdown = (signal) => {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

let exitCode = 0;
children.forEach((child) => {
  child.on("exit", (code) => {
    if (typeof code === "number" && code !== 0) {
      exitCode = code;
    }
  });
});

process.on("exit", () => process.exit(exitCode));
