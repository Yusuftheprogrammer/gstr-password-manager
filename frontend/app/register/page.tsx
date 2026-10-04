"use client"
import { apiRegister } from "@/lib/api"
import { getRandomSalt, deriveAuthHash, bufferToBase64 } from "@/lib/crypto"
import { useState } from "react"

export default function Register() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const authSalt = getRandomSalt()
      const encryptionSalt = getRandomSalt()

      const authHashBuffer = await deriveAuthHash(password, authSalt)
      const authHash = bufferToBase64(authHashBuffer)

      await apiRegister({
        name,
        email,
        authHash,
        authSalt: bufferToBase64(authSalt),
        encryptionSalt: bufferToBase64(encryptionSalt),
      })

      setStatus("Registered successfully! You can now log in.")
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold">Join Us.</h1>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="ex. Fulan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Master password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Choose a strong master password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90"
        >
          Register
        </button>

        <p className="text-sm text-muted-foreground">{status}</p>
      </form>
    </div>
  )
}
