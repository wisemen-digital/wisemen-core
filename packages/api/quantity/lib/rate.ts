export class Rate {
  private constructor (private value: number) {}

  static fromDecimal (decimal: number): Rate {
    return new Rate(decimal)
  }

  static fromPercent (percent: number): Rate {
    return new Rate(percent / 100)
  }

  static fromPermille (permille: number): Rate {
    return new Rate(permille / 1000)
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

  toString(): string {
    return `${this.asPercent()}%`
  }
}