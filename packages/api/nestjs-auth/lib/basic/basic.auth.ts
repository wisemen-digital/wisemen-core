import { timingSafeEqual } from 'crypto'
import { BasicAuthCredential } from './basic-auth.types.js'

// based on express-basic-auth
export function compareBasicAuth (
  input: BasicAuthCredential,
  stored: BasicAuthCredential
): boolean {
  const usernameMatch = safeCompare(input.username, stored.username)
  const passwordMatch = safeCompare(input.password, stored.password)

  const result = Number(usernameMatch) & Number(passwordMatch)

  return !!result
}

export function safeCompare (input: string, secret: string): number {
  const inputBuf = Buffer.from(input, 'utf8')
  const secretBuf = Buffer.from(secret, 'utf8')

  const length = Math.max(inputBuf.length, secretBuf.length)
  const inputPadded = Buffer.alloc(length, 0)
  const secretPadded = Buffer.alloc(length, 0)

  inputBuf.copy(inputPadded)
  secretBuf.copy(secretPadded)

  const match = Number(timingSafeEqual(inputPadded, secretPadded))
  const exactLength = Number(inputBuf.length === secretBuf.length)

  return match & exactLength
}