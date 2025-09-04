export async function apiFetch(path, options = {}) {
  const base = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
  const res = await fetch(base + path, { ...options });
  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
