//#region File Documentation
/**
 * File: src/ai/analyze.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Sends all collected SEO signals to Claude and returns a zod-validated audit result.
 * - Rendering model: Server-only module (worker or Route Handler).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Mock mode never calls the network. Real mode requires ANTHROPIC_API_KEY.
 * - Invalid JSON or schema violations trigger one corrective retry, then a clear error.
 *
 * Connected Modules:
 * - src/ai/prompt.ts, src/lib/audit-schema.ts, src/mocks/claude.mock.ts, src/lib/env.ts
 *
 * Dependencies:
 * - @anthropic-ai/sdk: official Claude API client.
 * - zod (via audit-schema): response validation.
 */
//#endregion

import Anthropic from "@anthropic-ai/sdk";
import { auditResultSchema } from "@/lib/audit-schema";
import { env } from "@/lib/env";
import { USE_MOCKS } from "@/mocks";
import { mockAuditResult } from "@/mocks/claude.mock";
import { AUDIT_MODEL, SYSTEM_PROMPT, buildUserPrompt } from "@/ai/prompt";
import type { AnalysisInput, AuditResult } from "@/types/audit";

const MAX_ATTEMPTS = 2;
const MAX_TOKENS = 6000;
const REQUEST_TIMEOUT_MS = 90_000;

interface AnalyzeOptions {
  forceReal?: boolean;
}

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in the model response");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function requestCompletion(
  client: Anthropic,
  messages: Anthropic.MessageParam[],
): Promise<string> {
  const response = await client.messages.create({
    model: AUDIT_MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages,
  });

  return response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");
}

export async function analyzeWithClaude(
  input: AnalysisInput,
  options: AnalyzeOptions = {},
): Promise<AuditResult> {
  if (USE_MOCKS && !options.forceReal) {
    return auditResultSchema.parse(mockAuditResult);
  }

  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is missing. Add it to .env or use USE_MOCKS=true.");
  }

  const client = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
    timeout: REQUEST_TIMEOUT_MS,
  });

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: buildUserPrompt(input) },
  ];
  let lastError = "Unknown error";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const text = await requestCompletion(client, messages);

    try {
      const parsed = auditResultSchema.safeParse(extractJson(text));
      if (parsed.success) {
        return parsed.data;
      }
      lastError = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Response was not valid JSON";
    }

    messages.push(
      { role: "assistant", content: text },
      {
        role: "user",
        content: `Your previous response was invalid: ${lastError}. Respond again with only the corrected JSON object.`,
      },
    );
  }

  throw new Error(
    `Claude returned an invalid audit result after ${MAX_ATTEMPTS} attempts: ${lastError}`,
  );
}