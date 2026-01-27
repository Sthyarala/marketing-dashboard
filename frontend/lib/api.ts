export async function apiFetch(
  url: string,
  token: string | null
) {
  const res = await fetch(`http://localhost:5000${url}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

  if (!res.ok) {
    throw new Error('API error');
  }

  return res.json();
}
