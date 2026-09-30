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
