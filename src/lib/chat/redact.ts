// Email/phone redaction for restricted question logs. This is not a general
// personal/confidential-data scrubber; storage access must remain restricted.

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

// Matches common US-style phone formats: (555) 123-4567, 555-123-4567,
// 555.123.4567, +1 555 123 4567, 5551234567. Deliberately permissive
// since over-redacting a false positive is harmless here.
const PHONE_RE = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

export function redact(text: string): string {
  return text.replace(EMAIL_RE, "[redacted]").replace(PHONE_RE, "[redacted]");
}
