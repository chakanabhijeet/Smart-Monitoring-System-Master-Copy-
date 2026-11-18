// Turns any API / network error into one readable message.
// Works with { error: "..." }, { message: "..." }, { detail: "..." } and plain text.
export function getApiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again."
) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) return data;

  const message = data?.error || data?.message || data?.detail;

  if (typeof message === "string" && message.trim()) return message;

  return error?.message || fallback;
}