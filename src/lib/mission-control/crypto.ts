import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

const CIPHER_ALGO = 'aes-256-gcm'
const IV_BYTES = 12
const AUTH_TAG_BYTES = 16

function loadEncryptionKey(): Buffer {
  const fromEnv = process.env.MISSION_CONTROL_TOKEN_ENCRYPTION_KEY

  if (fromEnv) {
    const key = Buffer.from(fromEnv, 'base64')
    if (key.byteLength !== 32) {
      throw new Error('MISSION_CONTROL_TOKEN_ENCRYPTION_KEY must be base64 for exactly 32 bytes')
    }
    return key
  }

  return createHash('sha256')
    .update(process.env.MISSION_CONTROL_SESSION_SECRET || 'superaicoach-mission-control-dev-key')
    .digest()
}

export function encryptToken(plainTextToken: string): string {
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

export function decryptToken(encryptedToken: string): string {
  const payload = Buffer.from(encryptedToken, 'base64url')
  const iv = payload.subarray(0, IV_BYTES)
  const authTag = payload.subarray(IV_BYTES, IV_BYTES + AUTH_TAG_BYTES)
  const encrypted = payload.subarray(IV_BYTES + AUTH_TAG_BYTES)

  const key = loadEncryptionKey()
  const decipher = createDecipheriv(CIPHER_ALGO, key, iv)
  decipher.setAuthTag(authTag)

  const plainText = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return plainText.toString('utf8')
}
