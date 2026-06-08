import { exhaustiveCheck } from "../exhaustive-check.js"
import { RateScale } from "./rate-scale.enum.js"

export class Rate {
  private readonly value: number

  constructor (value: number, scale: RateScale) {
    switch (scale) {
      case RateScale.DECIMAL:
        this.value = value
        break
      case RateScale.PERCENT:
        this.value = value / 100
        break
      case RateScale.PERMILLE:
        this.value = value / 1000
        break
      default:
        exhaustiveCheck(scale)
    }
  }

  static fromDecimal (decimal: number): Rate {
    return new Rate(decimal, RateScale.DECIMAL)
  }

  static fromPercent (percent: number): Rate {
    return new Rate(percent, RateScale.PERCENT)
  }

  static fromPermille (permille: number): Rate {
    return new Rate(permille, RateScale.PERMILLE)
  }

  asDecimal (): number {
    return this.value
  }

  asPercent (): number {
    return this.value * 100
  }

  asPermille (): number {
    return this.value * 1000
  }

  toString(scale = RateScale.PERCENT, fractionDigits = 2): string {
    switch (scale) {
      case RateScale.DECIMAL:
        return this.asDecimal().toFixed(fractionDigits)
      case RateScale.PERCENT:
        return `${this.asPercent().toFixed(fractionDigits)}%`
      case RateScale.PERMILLE:
        return `${this.asPermille().toFixed(fractionDigits)}‰`
    }
  }
}
