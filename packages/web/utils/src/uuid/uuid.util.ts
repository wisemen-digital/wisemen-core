/**
 * The nil UUID — all zeros. Useful as a sentinel or default value.
 */
const NIL_UUID = '00000000-0000-0000-0000-000000000000'

const UUID_REGEX = /^[\da-f]{8}-[\da-f]{4}-[1-8][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i

const UUID_V4_FALLBACK_REGEX = /[xy]/g

/**
 * Utility class for UUID generation and validation.
 */
export class UuidUtil {
  /**
   * The nil UUID: `00000000-0000-0000-0000-000000000000`.
   * Useful as a sentinel/default value or as a placeholder before a real ID is assigned.
   */
  static readonly NIL: string = NIL_UUID

  /**
   * Generates a random UUID v4.
   * Uses the native `crypto.randomUUID()` API when available,
   * with a manual fallback for older environments.
   *
   * @example
   * UuidUtil.generate() // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
   */
  static generate(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }

    // Fallback for environments without crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(UUID_V4_FALLBACK_REGEX, (char) => {
      const random = (Math.random() * 16) | 0
      const value = char === 'x' ? random : (random & 0x3) | 0x8

      return value.toString(16)
    })
  }

  /**
   * Returns `true` if the given string is the nil UUID (`00000000-0000-0000-0000-000000000000`).
   *
   * @example
   * UuidUtil.isNil('00000000-0000-0000-0000-000000000000') // true
   * UuidUtil.isNil('f47ac10b-58cc-4372-a567-0e02b2c3d479') // false
   */
  static isNil(value: string): boolean {
    return value === NIL_UUID
  }

  /**
   * Returns `true` if the given string is both a valid UUID and not the nil UUID.
   *
   * @example
   * UuidUtil.isNonNil('f47ac10b-58cc-4372-a567-0e02b2c3d479') // true
   * UuidUtil.isNonNil('00000000-0000-0000-0000-000000000000') // false
   */
  static isNonNil(value: string): boolean {
    return UuidUtil.isValid(value) && !UuidUtil.isNil(value)
  }

  /**
   * Returns `true` if the given string is a valid UUID (any version, canonical format).
   *
   * @example
   * UuidUtil.isValid('f47ac10b-58cc-4372-a567-0e02b2c3d479') // true
   * UuidUtil.isValid('not-a-uuid') // false
   */
  static isValid(value: string): boolean {
    return UUID_REGEX.test(value)
  }
}
