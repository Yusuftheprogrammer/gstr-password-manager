const API_URL = "http://localhost:3000";

export async function apiRegister(data: {
  name: string;
  email: string;
  authHash: string;
  authSalt: string;
  encryptionSalt: string;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  return res.json();
}

export async function apiGetSalt(email: string): Promise<{ authSalt: string }> {
  const res = await fetch(`${API_URL}/auth/salt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch salt");
  }

  return res.json();
}

export async function apiLogin(data: {
  email: string;
  authHash: string;
}): Promise<{ accessToken: string; encryptionSalt: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return res.json();
}
