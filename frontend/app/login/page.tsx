"use client";

import { apiGetSalt, apiLogin } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  base64ToBuffer,
  bufferToBase64,
  deriveAuthHash,
  deriveEncryptionKey,
} from "@/lib/crypto";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const setEncryptionKey = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setStatus("Logging in...");

      const { authSalt: authSaltBase64 } = await apiGetSalt(email);
      const authSalt = base64ToBuffer(authSaltBase64);

      const authHashBuffer = await deriveAuthHash(password, authSalt);
      const authHash = bufferToBase64(authHashBuffer);

      console.log("authHash at login:", authHash);

      const res = await apiLogin({
        email,
        authHash,
      });

      localStorage.setItem("accessToken", res.accessToken);

      const encryptionSalt = base64ToBuffer(res.encryptionSalt);

      const encryptionKey = await deriveEncryptionKey(password, encryptionSalt);
      setEncryptionKey.setEncryptionKey(encryptionKey);

      setStatus("Logged in successfully!");

      router.push("/vault");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Master password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button type="submit">Login</button>
      <p>{status}</p>
    </form>
  );
}
