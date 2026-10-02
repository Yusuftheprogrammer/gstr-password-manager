"use client";

import { apiGetVault, apiPostEntry } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  base64ToBuffer,
  bufferToBase64,
  decrypt,
  decryptWithKey,
  encryptWithKey,
  getRandomIv,
} from "@/lib/crypto";
import { useCallback, useEffect, useState } from "react";

interface VaultItem {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
}

export default function VaultPage() {
  const { encryptionKey } = useAuth();
  const [entries, setEntries] = useState<VaultItem[]>([]);
  const [status, setStatus] = useState("");

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [url, setUrl] = useState("");

  const loadEntries = useCallback(async () => {
    if (!encryptionKey) {
      setStatus("No encryption key — please log in again.");
      return;
    }

    try {
      const raw = await apiGetVault();
      const decrypted: VaultItem[] = [];

      for (const item of raw) {
        const ciphertext = base64ToBuffer(item.ciphertext)
          .buffer as ArrayBuffer;
        const iv = base64ToBuffer(item.iv);

        const plainBytes = await decryptWithKey(ciphertext, encryptionKey, iv);
        const plainText = new TextDecoder().decode(plainBytes);
        const parsed = JSON.parse(plainText);

        decrypted.push({ id: item.id, ...parsed });
      }

      setEntries(decrypted);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to load vault");
    }
  }, [encryptionKey]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!encryptionKey) {
      setStatus("No encryption key — please log in again.");
      return;
    }

    try {
      const plaintext = JSON.stringify({
        title,
        username,
        password: newPassword,
        url,
      });

      const iv = getRandomIv();

      const ciphertextBuffer = await encryptWithKey(
        plaintext,
        encryptionKey,
        iv,
      );

      await apiPostEntry({
        ciphertext: bufferToBase64(ciphertextBuffer),
        iv: bufferToBase64(iv),
      });

      setTitle("");
      setUsername("");
      setNewPassword("");
      setUrl("");

      await loadEntries();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to load vault");
    }
  };

  return (
    <>
      <div>
        <h1>Vault</h1>
        <p>{status}</p>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              {entry.title} — {entry.username}
            </li>
          ))}
        </ul>
      </div>

      <h2>Add new entry</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <br />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <br />
        <button type="submit">Add</button>
      </form>
    </>
  );
}

