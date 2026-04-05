// Hybrid encryption: RSA-OAEP 4096-bit wraps an ephemeral AES-GCM 256-bit key.
// All operations use the browser's built-in Web Crypto API.

function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const byte of bytes) str += String.fromCharCode(byte);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlToBuffer(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const str = atob(padded);
  const buffer = new ArrayBuffer(str.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return buffer;
}

function bufferToPem(buffer, label) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const lines = base64.match(/.{1,64}/g).join('\n');
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
}

function pemToBuffer(pem) {
  const base64 = pem
    .replace(/-----BEGIN[^-]*-----/, '')
    .replace(/-----END[^-]*-----/, '')
    .replace(/\s/g, '');
  const str = atob(base64);
  const buffer = new ArrayBuffer(str.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return buffer;
}

const RSA_PARAMS = {
  name: 'RSA-OAEP',
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-256',
};

export async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(RSA_PARAMS, true, ['encrypt', 'decrypt']);

  const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: bufferToBase64url(publicKeyBuffer),
    privateKeyPem: bufferToPem(privateKeyBuffer, 'PRIVATE KEY'),
  };
}

export async function encryptText(text, publicKeyB64url) {
  const publicKey = await crypto.subtle.importKey(
    'spki',
    base64urlToBuffer(publicKeyB64url),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );

  // Generate ephemeral AES-GCM key
  const aesKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
  const aesKeyBuffer = await crypto.subtle.exportKey('raw', aesKey);

  // Encrypt the AES key with RSA-OAEP
  const encryptedAesKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, aesKeyBuffer);

  // Encrypt the plaintext with AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    new TextEncoder().encode(text)
  );

  // Bundle: [2 bytes: encAesKeyLen][encAesKey][12 bytes: iv][ciphertext]
  const encKeyLen = encryptedAesKey.byteLength;
  const result = new Uint8Array(2 + encKeyLen + 12 + ciphertext.byteLength);
  new DataView(result.buffer).setUint16(0, encKeyLen);
  result.set(new Uint8Array(encryptedAesKey), 2);
  result.set(iv, 2 + encKeyLen);
  result.set(new Uint8Array(ciphertext), 2 + encKeyLen + 12);

  return bufferToBase64url(result.buffer);
}

export async function decryptText(encryptedB64url, privateKeyPem) {
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToBuffer(privateKeyPem),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  );

  const data = new Uint8Array(base64urlToBuffer(encryptedB64url));
  const encKeyLen = new DataView(data.buffer).getUint16(0);
  const encryptedAesKey = data.slice(2, 2 + encKeyLen);
  const iv = data.slice(2 + encKeyLen, 2 + encKeyLen + 12);
  const ciphertext = data.slice(2 + encKeyLen + 12);

  // Decrypt the AES key
  const aesKeyBuffer = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedAesKey);

  const aesKey = await crypto.subtle.importKey('raw', aesKeyBuffer, { name: 'AES-GCM' }, false, ['decrypt']);

  // Decrypt the ciphertext
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertext);

  return new TextDecoder().decode(plaintext);
}
