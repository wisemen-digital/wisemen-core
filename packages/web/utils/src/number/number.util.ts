export class NumberUtil {
  /**
   * Returns the arithmetic mean (average) of all numbers in an array.
   * Returns 0 for an empty array.
   *
   * @example
   * NumberUtil.average([1, 2, 3, 4]) // 2.5
   */
  static average(values: number[]): number {
    if (values.length === 0) {
      return 0
    }

    return NumberUtil.sum(values) / values.length
  }

  /**
   * Clamps a number between a minimum and maximum value.
   *
   * @example
   * NumberUtil.clamp(15, 0, 10) // 10
   * NumberUtil.clamp(-5, 0, 10) // 0
   * NumberUtil.clamp(5, 0, 10)  // 5
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  /**
   * Calculates what percentage `value` is of `total`.
   * Returns 0 when `total` is 0 to avoid division by zero.
   *
   * @example
   * NumberUtil.percentage(25, 200) // 12.5
   * NumberUtil.percentage(1, 0)    // 0
   */
  static percentage(value: number, total: number): number {
    if (total === 0) {
      return 0
    }

    return (value / total) * 100
  }

  /**
   * Rounds a number to a given number of decimal places.
   *
   * @example
   * NumberUtil.round(3.14159, 2) // 3.14
   * NumberUtil.round(1.005, 2)   // 1.01
   */
  static round(value: number, decimals: number = 0): number {
    const factor = 10 ** decimals

    return Math.round(value * factor) / factor
  }

  /**
   * Returns the sum of all numbers in an array.
   * Returns 0 for an empty array.
   *
   * @example
   * NumberUtil.sum([1, 2, 3, 4]) // 10
   */
  static sum(values: number[]): number {
    return values.reduce((acc, n) => acc + n, 0)
  }
}
