export class NumberFormatUtil {
  /**
   * Round a number to a specific number of decimal places.
   * E.g., roundTo(3.14159, 2) → 3.14.
   */
  static roundTo(value: number, decimals: number): number {
    const factor = 10 ** decimals

    return Math.round(value * factor) / factor
  }
}
