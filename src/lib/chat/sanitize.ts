/**
 * Strips em dashes from model output as a deterministic safety net.
 * system-prompt.md already instructs the model never to use them, but
 * that's a style rule the model doesn't follow with full consistency
 * (observed directly in real-mode testing), so this guarantees the
 * visitor never sees one regardless of how well the prompt is followed.
 * Replaces each with a comma, which reads naturally for the large
 * majority of real em-dash usage (asides, clause joins); collapses any
 * resulting double comma from text that already had one nearby.
 */
export function stripEmDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ", ").replace(/,(\s*,)+/g, ",");
}
