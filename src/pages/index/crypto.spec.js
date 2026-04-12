import { describe, it, expect, } from 'vitest';
import { 
  generateKeyPair, encryptText, decryptText,
  } from './crypto.js';

describe("crypto.js", () => {
  it("Generates, encrypt and decrypt text", async () => {
    const { 
      publicKey, privateKeyPem, 
    } = await generateKeyPair();

    const text = "Claude Code works!";
    const encrypted = await encryptText(text, publicKey);
    const decrypted = await decryptText(encrypted, privateKeyPem);

    expect(decrypted).toBe(text);
  });
});
