# GSTR Password Manager

It's a self-hosted, zero-knowledge password manager - open-source alternative to paid tools like BitWarden

## Why did i do it?

well, it's unreasonable to pay a subscription just so a third-party company can store your passwords, and this project was a fun break from writing boring CRUD apps (I'm a backend dev btw)

## How it's zero knowledge?

this is the fun part, first the keys to encrypt and decrypt will be in client's side (frontend in this case) this means server can't see your passwords neither the data, and it can't decrypt your passwords, I'll explain this in steps:

- Your master password never leaves the browser
- It used to derive two separate values via PBKDF2 (600,000 iterations - OWASP standard):
  - an **auth-hash** which sent to the backend for authentication and to know who you are (hashed again with bcrypt before storing in the db)
  - and **encryption-key** which stays in memory in the browser and is used to encrypt and decrypt vault entries with AES-256-GCM
- The server only stores the ciphertext, iv, and salts and none of them can be used to decrypt your data

even if the db is breached, the hacker can't decrypt the data

## Features

- Account registration and login
- Add, edit, delete, and view vault entries (title, username, password, URL)
- Client-side password generator
- Clipboard auto-clear after 20 seconds
- Fully self-hostable via Docker Compose

## Tech stack

- **Backend:** NestJS, TypeORM, PostgreSQL, JWT auth, bcrypt
- **Frontend:** Next.js (App Router), React Context for in-memory key storage
- **Crypto:** Web Crypto API (PBKDF2 + AES-GCM) — no custom cryptography
- **Runtime:** Bun

## Running it yourself

```bash
git clone https://github.com/<your-username>/gstr-password-manager.git
cd gstr-password-manager
docker compose up --build
```

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`

A local PostgreSQL instance is spun up automatically via Docker Compose — no external database or cloud account required.


## Security notes / known limitations

This app considered side-project so of course it's not the best and securest password manager and this project has not undergone a professional security audit. It follows standard practices (PBKDF2, AES-GCM, no custom crypto), but shouldn't be used to store real sensitive credentials without further review.

- The `/auth/salt` endpoint can be used to check whether an email is registered (a known trade-off, also present in early versions of similar tools).
- No 2FA, no vault sharing, no browser extension — out of scope for this build.
- The encryption key lives only in memory and clears on page refresh, by design — this matches "lock on browser restart" behavior in tools like Bitwarden.
