/**
 * Turns Firebase / API / unknown errors into a short user-facing string.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error === null || error === undefined) return fallback;
  if (typeof error === 'string' && error.trim()) return error.trim();
  if (error instanceof Error) {
    const msg = error.message?.trim();
    return msg || fallback;
  }
  if (typeof error === 'object') {
    const anyErr = error as { message?: unknown; code?: unknown };
    const msg = typeof anyErr.message === 'string' ? anyErr.message.trim() : '';
    if (msg) return msg;
    const code = typeof anyErr.code === 'string' ? anyErr.code.trim() : '';
    if (code) return `${code}: ${fallback}`;
  }
  return fallback;
}
