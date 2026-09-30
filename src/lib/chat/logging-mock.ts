import type { QuestionLogEntry } from "./logging";

// In-memory stand-in for logging.ts. Exported so the mock API route (or a
// future debug endpoint) can print what would have been logged.
export const mockLog: QuestionLogEntry[] = [];

export async function logQuestionMock(entry: QuestionLogEntry): Promise<void> {
  mockLog.unshift(entry);
  if (mockLog.length > 2000) mockLog.length = 2000;
}
