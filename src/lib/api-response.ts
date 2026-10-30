//#region File Documentation
/**
 * File: src/lib/api-response.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Consistent JSON responses, request-body parsing and error handling for Route Handlers.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Unexpected errors are logged on the server and returned as a generic 500 message.
 * - Success shape: { data }. Error shape: { error, details? }.
 *
 * Connected Modules:
 * - src/lib/validations.ts, src/app/api/**
 *
 * Dependencies:
 * - zod: type of the schema that is parsed.
 */
//#endregion

import { NextResponse } from "next/server";
import type { ZodType } from "zod";

export interface IssueDetail {
  field: string;
  message: string;
}

export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function jsonError(
  message: string,
  status: number,
  details?: IssueDetail[],
): NextResponse {
  return NextResponse.json(details ? { error: message, details } : { error: message }, {
    status,
  });
}

export function serverError(error: unknown): NextResponse {
  console.error("[api] unexpected error:", error);
  return jsonError("Something went wrong. Please try again.", 500);
}

export function formatIssues(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): IssueDetail[] {
  return issues.map((issue) => ({
    field: issue.path.map(String).join("."),
    message: issue.message,
  }));
}

export type ParsedInput<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<ParsedInput<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { success: false, response: jsonError("Request body must be valid JSON", 400) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      success: false,
      response: jsonError("Validation failed", 400, formatIssues(parsed.error.issues)),
    };
  }
  return { success: true, data: parsed.data };
}