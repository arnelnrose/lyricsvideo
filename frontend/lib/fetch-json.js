export async function fetchJSON(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const raw = await res.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const fallbackMessage = raw?.trim().startsWith("<")
      ? `Server returned HTML instead of JSON (${res.status}). Check Next.js server logs.`
      : `Request failed (${res.status})`;
    throw new Error(data?.error || fallbackMessage);
  }
  return data;
}
