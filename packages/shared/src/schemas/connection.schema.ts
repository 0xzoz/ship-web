import { z } from "zod";

export const connectionServiceSchema = z.enum(["claude", "codex"]);

export const connectKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

export type ConnectionService = z.infer<typeof connectionServiceSchema>;
export type ConnectKeyInput = z.infer<typeof connectKeySchema>;
