// js/utils/crypto.js
// Real SHA-256 with both Web Crypto API and pure-JS fallback for non-HTTPS LAN

// ── Pure JavaScript SHA-256 (synchronous, works on http:// LAN) ──────────
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(n, x) { return (x >>> n) | (x << (32 - n)); }
function ch(x, y, z) { return (x & y) ^ (~x & z); }
function maj(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); }
function sigma0(x) { return rotr(2, x) ^ rotr(13, x) ^ rotr(22, x); }
function sigma1(x) { return rotr(6, x) ^ rotr(11, x) ^ rotr(25, x); }
function gamma0(x) { return rotr(7, x) ^ rotr(18, x) ^ (x >>> 3); }
function gamma1(x) { return rotr(17, x) ^ rotr(19, x) ^ (x >>> 10); }

function sha256Sync(message) {
  // Convert string to UTF-8 bytes
  const encoder = new TextEncoder();
  const msgBytes = encoder.encode(message);
  const msgLen = msgBytes.length;

  // Pre-processing: padding
  const bitLen = msgLen * 8;
  const paddingLen = ((56 - (msgLen + 1) % 64) + 64) % 64;
  const totalLen = msgLen + 1 + paddingLen + 8;
  const buffer = new Uint8Array(totalLen);
  buffer.set(msgBytes);
  buffer[msgLen] = 0x80;

  // Append original length in bits as 64-bit big-endian
  const view = new DataView(buffer.buffer);
  // For messages < 2^32 bits, high 32 bits are 0
  view.setUint32(totalLen - 4, bitLen, false);

  // Initialize hash values
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  const W = new Uint32Array(64);

  // Process each 512-bit (64-byte) block
  for (let offset = 0; offset < totalLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      W[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) >>> 0;
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    for (let i = 0; i < 64; i++) {
      const T1 = (h + sigma1(e) + ch(e, f, g) + K[i] + W[i]) >>> 0;
      const T2 = (sigma0(a) + maj(a, b, c)) >>> 0;
      h = g; g = f; f = e;
      e = (d + T1) >>> 0;
      d = c; c = b; b = a;
      a = (T1 + T2) >>> 0;
    }

    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }

  // Produce hex output
  const hex = (n) => n.toString(16).padStart(8, '0');
  return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4) + hex(h5) + hex(h6) + hex(h7);
}

// ── Async Web Crypto API version (for non-critical paths) ──────────
let subtleAvailable = false;
try {
  if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
    subtleAvailable = true;
  }
} catch (e) {
  subtleAvailable = false;
}

async function sha256Async(message) {
  if (subtleAvailable) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fall back to sync if subtle fails at runtime (e.g. non-secure context)
      return sha256Sync(message);
    }
  }
  return sha256Sync(message);
}

// ── Public API ──────────────────────────────────────────────────────
/**
 * Synchronous SHA-256 — safe for 60fps game loops and LAN http:// contexts.
 */
export function hashSync(input) {
  return sha256Sync(String(input));
}

/**
 * Async SHA-256 — prefers native Web Crypto when available.
 */
export async function hashAsync(input) {
  return sha256Async(String(input));
}

/**
 * Check if a hash meets the target difficulty (starts with N leading zeros).
 */
export function meetsTarget(hash, prefix = '0000') {
  return hash.startsWith(prefix);
}

/**
 * Compute a block hash from its data fields.
 */
export function computeBlockHash(index, prevHash, data, nonce, timestamp) {
  return sha256Sync(`${index}${prevHash}${data}${nonce}${timestamp}`);
}
