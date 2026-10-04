"use client"

import {
  apiDeleteEntry,
  apiGetVault,
  apiPostEntry,
  apiUpdateEntry,
} from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import {
  base64ToBuffer,
  bufferToBase64,
  decryptWithKey,
  encryptWithKey,
  generatePassword,
  getRandomIv,
} from "@/lib/crypto"
import { useCallback, useEffect, useState } from "react"

interface VaultItem {
  id: string
  title: string
  username: string
  password: string
  url: string
}

export default function VaultPage() {
  const { encryptionKey } = useAuth()
  const [entries, setEntries] = useState<VaultItem[]>([])
  const [status, setStatus] = useState("")

  const [title, setTitle] = useState("")
  const [username, setUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [url, setUrl] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)

  function startEdit(entry: VaultItem) {
    setTitle(entry.title)
    setUsername(entry.username)
    setNewPassword(entry.password)
    setUrl(entry.url)
    setEditingId(entry.id)
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)

    setStatus(
      "Password copied successfully! Clipboard will clear in 20 seconds."
    )

    setTimeout(() => {
      navigator.clipboard.writeText("")
    }, 20000)
  }

  const loadEntries = useCallback(async () => {
    if (!encryptionKey) {
      setStatus("No encryption key — please log in again.")
      return
    }

    try {
      const raw = await apiGetVault()
      const decrypted: VaultItem[] = []

      for (const item of raw) {
        const ciphertext = base64ToBuffer(item.ciphertext).buffer as ArrayBuffer
        const iv = base64ToBuffer(item.iv)

        const plainBytes = await decryptWithKey(ciphertext, encryptionKey, iv)
        const plainText = new TextDecoder().decode(plainBytes)
        const parsed = JSON.parse(plainText)

        decrypted.push({ id: item.id, ...parsed })
      }

      setEntries(decrypted)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to load vault")
    }
  }, [encryptionKey])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!encryptionKey) {
      setStatus("No encryption key — please log in again.")
      return
    }

    try {
      const plaintext = JSON.stringify({
        title,
        username,
        password: newPassword,
        url,
      })
      const iv = getRandomIv()
      const ciphertextBuffer = await encryptWithKey(
        plaintext,
        encryptionKey,
        iv
      )

      const payload = {
        ciphertext: bufferToBase64(ciphertextBuffer),
        iv: bufferToBase64(iv),
      }

      if (editingId) {
        await apiUpdateEntry(editingId, payload)
      } else {
        await apiPostEntry(payload)
      }

      setTitle("")
      setUsername("")
      setNewPassword("")
      setUrl("")
      setEditingId(null)

      await loadEntries()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save entry")
    }
  }

  async function refresh() {
    await loadEntries()
  }

  async function handleDelete(id: string) {
    try {
      await apiDeleteEntry(id)
      await loadEntries()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to delete entry")
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
  const primaryBtn =
    "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
  const ghostBtn =
    "rounded-md border border-border px-3 py-1.5 text-sm transition hover:bg-accent"

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vault</h1>
        <button onClick={loadEntries} className={ghostBtn}>
          Refresh
        </button>
      </div>

      {status && <p className="text-sm text-muted-foreground">{status}</p>}

      {/* Entries */}
      <section className="rounded-lg border border-border bg-card p-6">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No entries yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{entry.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {entry.username}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => copyToClipboard(entry.password)}
                    className={ghostBtn}
                  >
                    Copy
                  </button>
                  <button onClick={() => startEdit(entry)} className={ghostBtn}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className={`${ghostBtn} text-destructive`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Form */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit entry" : "Add new entry"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className={inputClass}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              className={inputClass}
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className={`${ghostBtn} shrink-0`}
              onClick={() =>
                setNewPassword(
                  generatePassword(16, { numbers: true, symbols: true })
                )
              }
            >
              Generate
            </button>
          </div>
          <input
            className={inputClass}
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="submit" className={primaryBtn}>
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className={ghostBtn}
                onClick={() => {
                  setTitle("")
                  setUsername("")
                  setNewPassword("")
                  setUrl("")
                  setEditingId(null)
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
