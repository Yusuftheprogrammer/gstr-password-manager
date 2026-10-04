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

export function getToken() {
  return localStorage.getItem("accessToken");
}

export async function apiGetVault(): Promise<
  {
    id: string;
    ciphertext: string;
    iv: string;
  }[]
> {
  const res = await fetch(`${API_URL}/vault`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch vault");
  return res.json();
}

export async function apiPostEntry(data: { ciphertext: string; iv: string }) {
  const res = await fetch(`${API_URL}/vault`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  return res.json();
}

export async function apiUpdateEntry(
  id: string,
  body: { ciphertext: string; iv: string },
) {
  const res = await fetch(`${API_URL}/vault/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to update entry");
  return res.json();
}

export async function apiDeleteEntry(id: string) {
  const res = await fetch(`${API_URL}/vault/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete entry");
  return res.json();
}
