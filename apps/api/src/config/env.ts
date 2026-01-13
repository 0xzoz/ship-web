import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  const contents = fs.readFileSync(envFile, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const [key, ...rest] = trimmed.split("=");
    if (!key || rest.length === 0) {
      continue;
    }
    if (!(key in process.env)) {
      process.env[key] = rest.join("=").replace(/^"|"$/g, "");
    }
  }
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
