
import { encrypt } from "./crypto.js";

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12)); 

const enc = new TextEncoder();
const plaintext = enc.encode("my secret password");

const ciphertext = await encrypt(plaintext, salt, iv);

console.log("Ciphertext (bytes):", new Uint8Array(ciphertext));
console.log("Ciphertext (base64):", Buffer.from(ciphertext).toString("base64"));