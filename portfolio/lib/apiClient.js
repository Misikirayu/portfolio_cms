export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let payload;
    try {
      payload = await res.json();
    } catch {
      payload = { error: res.statusText };
    }
    const err = new Error(payload.error || "Request failed");
    err.issues = payload.issues;
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
}
