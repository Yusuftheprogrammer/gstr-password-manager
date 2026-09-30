function getMaterialKey(password: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ]);
}

export async function encrypt(
  plaintext: Uint8Array | string,
  password: string,
  salt: Uint8Array,
  iv: Uint8Array,
) {
  const bytes =
    typeof plaintext === "string"
      ? new TextEncoder().encode(plaintext)
      : plaintext;

  const materialKey = await getMaterialKey(password);
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 600000,
      hash: "SHA-256",
    },
    materialKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  return crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    bytes as BufferSource,
  );
}

export async function decrypt(
  ciphertext: ArrayBuffer,
  password: string,
  salt: Uint8Array,
  iv: Uint8Array,
) {
  const materialKey = await getMaterialKey(password);
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 600000,
      hash: "SHA-256",
    },
    materialKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  return crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    ciphertext as BufferSource,
  );
}

export function getRandomSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

export function getRandomIv(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function deriveAuthHash(password: string, salt: Uint8Array) {
  const materialKey = await getMaterialKey(password);
  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 600000,
      hash: "SHA-256",
    },
    materialKey,
    256
  );
}
