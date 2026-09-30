function getMaterialKey() {
  const key = prompt("Enter the password: ");
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(key), "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ]);
}

export async function encrypt(plaintext, salt, iv) {
  const materialKey = await getMaterialKey();
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 600000,
      hash: "SHA-256",
    },
    materialKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );


  return crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
}

export async function decrypt(ciphertext, salt, iv) {
  const materialKey = await getMaterialKey();
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 600000,
      hash: "SHA-256",
    },
    materialKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
}
