export class NumberFormatUtil {
  /**
   * Clamp a number within a range.
   * E.g., clamp(15, 0, 10) → 10, clamp(-5, 0, 10) → 0.
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  /**
   * Round a number to a specific number of decimal places.
   * E.g., roundTo(3.14159, 2) → 3.14.
   */
  static roundTo(value: number, decimals: number): number {
    const factor = 10 ** decimals

    return Math.round(value * factor) / factor
  }
}
