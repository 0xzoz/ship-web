import Anthropic from "@anthropic-ai/sdk";

export function createClaudeClient(apiKey: string) {
  return new Anthropic({ apiKey });
}

export const defaultClaudeModel = "claude-3-5-sonnet-20240620";
