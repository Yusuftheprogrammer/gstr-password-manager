"use client"

import { apiGetSalt, apiLogin } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import {
  base64ToBuffer,
  bufferToBase64,
  deriveAuthHash,
  deriveEncryptionKey,
} from "@/lib/crypto"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")
  const setEncryptionKey = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setStatus("Logging in...")

      const { authSalt: authSaltBase64 } = await apiGetSalt(email)
      const authSalt = base64ToBuffer(authSaltBase64)

      const authHashBuffer = await deriveAuthHash(password, authSalt)
      const authHash = bufferToBase64(authHashBuffer)

      console.log("authHash at login:", authHash)

      const res = await apiLogin({
        email,
        authHash,
      })

      localStorage.setItem("accessToken", res.accessToken)

      const encryptionSalt = base64ToBuffer(res.encryptionSalt)

      const encryptionKey = await deriveEncryptionKey(password, encryptionSalt)
      setEncryptionKey.setEncryptionKey(encryptionKey)

      setStatus("Logged in successfully!")

      router.push("/vault")
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
        <h1 className="text-2xl font-bold">Welcome Back</h1>

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
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Master password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Master password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90"
        >
          Login
        </button>

        <p className="text-sm text-muted-foreground">{status}</p>
      </form>
    </div>
  )
}
