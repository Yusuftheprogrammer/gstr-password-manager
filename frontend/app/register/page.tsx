"use client";
import { apiRegister } from "@/lib/api";
import { getRandomSalt, deriveAuthHash, bufferToBase64 } from "@/lib/crypto";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const authSalt = getRandomSalt();
      const encryptionSalt = getRandomSalt();

      const authHashBuffer = await deriveAuthHash(password, authSalt);
      const authHash = bufferToBase64(authHashBuffer);

      await apiRegister({
        name,
        email,
        authHash,
        authSalt: bufferToBase64(authSalt),
        encryptionSalt: bufferToBase64(encryptionSalt),
      });

      setStatus("Registered successfully! You can now log in.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
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
      <button type="submit">Register</button>
      <p>{status}</p>
    </form>
  );
}
