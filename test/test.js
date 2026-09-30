import { decrypt, encrypt } from "./crypto.js";

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12)); 

const enc = new TextEncoder();
const dec = new TextDecoder();

const original = "my secret password"
const plaintext = enc.encode(original);

console.log("Enter your password to encrypt: ");
const ciphertext = await encrypt(plaintext, salt, iv);
console.log("Ciphertext (base64):", Buffer.from(ciphertext).toString("base64"));


console.log("Enter your password to decrypt: ");
const decryptedBytes = await decrypt(ciphertext, salt, iv);
const decryptedText = dec.decode(decryptedBytes);
console.log("Decrypted Text: ", decryptedText);
console.log("Is the two are the same?: ", decryptedText === original)
