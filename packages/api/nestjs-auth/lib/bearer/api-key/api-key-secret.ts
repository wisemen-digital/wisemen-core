import { createHash, randomBytes } from 'crypto'
import { API_KEY_PREFIX } from '../constants.js'

const API_KEY_LAST_CHARS_LENGTH = 5
const API_KEY_BYTES_LENGTH = 24
const HEX_CHARACTERS_PER_BYTE = 2
const API_KEY_LENGTH = API_KEY_PREFIX.length + (API_KEY_BYTES_LENGTH * HEX_CHARACTERS_PER_BYTE)

export class ApiKeySecret {
  static mask (secret: string): string {
    return secret.slice(-API_KEY_LAST_CHARS_LENGTH).padStart(API_KEY_LENGTH, '*')
  }

  private secret: string
  private hashedSecret?: string

  constructor (key?: string) {
    if (key !== undefined) {
      this.secret = key
    } else {
      this.secret = `${API_KEY_PREFIX}${randomBytes(API_KEY_BYTES_LENGTH).toString('hex')}`
    }
  }

  get value (): string {
    return this.secret
  }

  get hash (): string {
    if (this.hashedSecret !== undefined) {
      return this.hashedSecret
    }

    this.hashedSecret = createHash('sha256')
      .update(this.secret)
      .digest('hex')

    return this.hashedSecret
  }

  get lastChars (): string {
    return this.secret.slice(-API_KEY_LAST_CHARS_LENGTH)
  }

  get maskedValue (): string {
    return this.lastChars.padStart(API_KEY_LENGTH, '*')
  }
}
