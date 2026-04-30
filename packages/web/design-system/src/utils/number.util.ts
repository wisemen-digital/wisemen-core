export class NumberUtil {
  static format(value: number, precision = 0): string {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: precision,
    }).format(value)
  }

  static randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
