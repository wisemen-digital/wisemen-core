import assert from 'assert'

export type QuantityConstructor<U extends string, Q extends Quantity<U, Q>> = {
  new (quantityOrValue: Q | number, unit?: U): Q
}

export abstract class Quantity<U extends string, Q extends Quantity<U, Q>> {
  protected abstract baseUnit: U
  protected abstract convertValueToBaseUnit (value: number, fromUnit: U): number
  protected abstract convertBaseUnitValueTo (value: number, toUnit: U): number

  readonly value: number
  readonly unit: U

  constructor (quantity: Q)
  constructor (value: number, unit: U)
  constructor (quantityOrValue: Q | number, unit?: U) {
    if (quantityOrValue instanceof Quantity) {
      this.value = quantityOrValue.value
      this.unit = quantityOrValue.unit
    } else {
      assert(unit !== undefined, 'Unit must be provided when constructing from a numeric value')
      this.value = quantityOrValue
      this.unit = unit
    }
  }

  private construct (quantityOrValue: Q | number, unit?: U): Q {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const Constructor = Object.getPrototypeOf(this).constructor as QuantityConstructor<U, Q>

    if (quantityOrValue instanceof Quantity) {
      return new Constructor(quantityOrValue)
    } else {
      assert(unit !== undefined, 'Unit must be provided when constructing from a numeric value')

      return new Constructor(quantityOrValue, unit)
    }
  }

  /** Converts the quantity to the specified unit */
  to (unit: U): Q {
    const value = this.convertBaseUnitValueTo(this.valueOf(), unit)

    return this.construct(value, unit)
  }

  /** Returns the numeric value of the quantity in the specified unit */
  asNumber (unit: U = this.unit): number {
    return this.to(unit).value
  }

  /** Checks whether the quantity is equal to another quantity */
  isEqualTo (value: number, unit: U): boolean
  isEqualTo (quantity: Q): boolean
  isEqualTo (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.construct(quantityOrValue, unit)

    return this.valueOf() === other.valueOf()
  }

  /** Checks whether the quantity is less than another quantity */
  isLessThan (value: number, unit: U): boolean
  isLessThan (quantity: Q): boolean
  isLessThan (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.construct(quantityOrValue, unit)

    return this.valueOf() < other.valueOf()
  }

  /** Checks whether the quantity is less than or equal to another quantity */
  isLessThanOrEqualTo (value: number, unit: U): boolean
  isLessThanOrEqualTo (quantity: Q): boolean
  isLessThanOrEqualTo (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.construct(quantityOrValue, unit)

    return this.valueOf() <= other.valueOf()
  }

  /** Checks whether the quantity is more than another quantity */
  isMoreThan (value: number, unit: U): boolean
  isMoreThan (quantity: Q): boolean
  isMoreThan (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.construct(quantityOrValue, unit)

    return this.valueOf() > other.valueOf()
  }

  /** Checks whether the quantity is more than or equal to another quantity */
  isMoreThanOrEqualTo (value: number, unit: U): boolean
  isMoreThanOrEqualTo (quantity: Q): boolean
  isMoreThanOrEqualTo (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.construct(quantityOrValue, unit)

    return this.valueOf() >= other.valueOf()
  }

  /** Creates a new quantity by adding the current quantity to another quantity */
  add (value: number, unit: U): Q
  add (quantity: Q): Q
  add (quantityOrValue: Q | number, unit?: U): Q {
    const other = this.construct(quantityOrValue, unit)

    return this.construct(this.valueOf() + other.valueOf(), this.baseUnit).to(this.unit)
  }

  /** Creates a new quantity by subtracting another quantity from the current quantity */
  subtract (value: number, unit: U): Q
  subtract (quantity: Q): Q
  subtract (quantityOrValue: Q | number, unit?: U): Q {
    const other = this.construct(quantityOrValue, unit)

    return this.construct(this.valueOf() - other.valueOf(), this.baseUnit).to(this.unit)
  }

  /** Creates a new quantity by multiplying the current quantity with the specified factor */
  multiply (factor: number): Q {
    return this.construct(this.valueOf() * factor, this.baseUnit).to(this.unit)
  }

  /** Creates a new quantity by dividing the current quantity by the specified divisor */
  divide (divisor: number): Q
  divide (value: number, unit: U): number
  divide (quantity: Q): number
  divide (divisor: number | Q, unit?: U): Q | number {
    if (divisor instanceof Quantity || unit !== undefined) {
      const other = this.construct(divisor, unit)

      return this.valueOf() / other.valueOf()
    } else {
      return this.construct(this.valueOf() / divisor, this.baseUnit).to(this.unit)
    }
  }

  /** Creates a new quantity by calculating the modulus of
   * the current quantity and another quantity */
  modulo (value: number, unit: U): Q
  modulo (quantity: Q): Q
  modulo (quantityOrValue: Q | number, unit?: U): Q {
    const other = this.construct(quantityOrValue, unit)

    return this.construct(this.valueOf() % other.valueOf(), this.baseUnit).to(this.unit)
  }

  /** Ceils the value to the nearest integer for the current unit */
  ceil (): Q {
    return this.construct(Math.ceil(this.value), this.unit)
  }

  /** Rounds the value half up to the nearest integer for the current unit */
  round (): Q {
    return this.construct(Math.round(this.value), this.unit)
  }

  /** Floors the value to the nearest integer for the current unit */
  floor (): Q {
    return this.construct(Math.floor(this.value), this.unit)
  }

  /** Checks whether the value is an integer for the current unit */
  isRounded (): boolean {
    return Number.isInteger(this.value)
  }

  toString (): string {
    return `${this.value}${this.unit}`
  }

  valueOf (): number {
    return this.convertValueToBaseUnit(this.value, this.unit)
  }

  export (): { value: number, unit: U } {
    return {
      value: this.value,
      unit: this.unit
    }
  }

  toJSON (): object {
    return {
      value: this.value,
      unit: this.unit
    }
  }

  /** Returns the maximum quantity from the provided quantities */
  static max<U extends string, Q extends Quantity<U, Q>> (
    ...quantities: Q[]
  ): Q {
    return quantities.reduce((max, quantity) =>
      quantity.valueOf() > max.valueOf() ? quantity : max
    )
  }

  /** Returns the minimum quantity from the provided quantities */
  static min<U extends string, Q extends Quantity<U, Q>> (
    ...quantities: Q[]
  ): Q {
    return quantities.reduce((min, quantity) =>
      quantity.valueOf() < min.valueOf() ? quantity : min
    )
  }
}
