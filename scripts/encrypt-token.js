#!/usr/bin/env node
/**
 * Encrypt an OpenClaw gateway token for storage in tenant_openclaw_endpoints
 * Usage: node scripts/encrypt-token.js <plaintext-token>
 */

import { createCipheriv, createHash, randomBytes } from 'node:crypto'

const CIPHER_ALGO = 'aes-256-gcm'
const IV_BYTES = 12

function loadEncryptionKey() {
  const fromEnv = process.env.MISSION_CONTROL_TOKEN_ENCRYPTION_KEY

  if (fromEnv) {
    const key = Buffer.from(fromEnv, 'base64')
    if (key.byteLength !== 32) {
      throw new Error('MISSION_CONTROL_TOKEN_ENCRYPTION_KEY must be base64 for exactly 32 bytes')
    }
    return key
  }

  // Fallback: SHA-256 hash of session secret
  return createHash('sha256')
    .update(process.env.MISSION_CONTROL_SESSION_SECRET || 'superaicoach-mission-control-dev-key')
    .digest()
}

function encryptToken(plainTextToken) {
  const key = loadEncryptionKey()
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(CIPHER_ALGO, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(plainTextToken, 'utf8'),
    cipher.final(),
  ])

  const authTag = cipher.getAuthTag()
  return Buffer.concat([iv, authTag, encrypted]).toString('base64url')
}

const token = process.argv[2]
if (!token) {
  console.error('Usage: node scripts/encrypt-token.js <plaintext-token>')
  process.exit(1)
}

console.log(encryptToken(token))
