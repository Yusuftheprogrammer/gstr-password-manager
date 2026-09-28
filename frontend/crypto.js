function getMaterialKey() {
  const key = prompt("Enter the password: ");
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    "PBKFD2",
    false,
    ["deriveBits", "deriveKey"]
  )
}


async function encrypt(plaintext, salt, iv) {
  const materialKey = await getMaterialKey()
  const key = await crypto.subtle.deriveKey({
    name: "PBKFD2",
    salt,
    iterations: 600000,
    hash: "SHA-256"
  }, materialKey, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);

  return crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
}

// helper functions
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
