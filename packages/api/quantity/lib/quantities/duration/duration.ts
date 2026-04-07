import { Quantity } from '../../quantity.js'
import { DurationUnit } from './duration-unit.enum.js'

const DISTANCE_MULTIPLIERS: Record<DurationUnit, number> = {
  [DurationUnit.SECONDS]: 1,
  [DurationUnit.MILLISECONDS]: 1e-3,
  [DurationUnit.MICROSECONDS]: 1e-6,
  [DurationUnit.NANOSECONDS]: 1e-9,
  [DurationUnit.MINUTES]: 60,
  [DurationUnit.HOURS]: 3600,
  [DurationUnit.DAYS]: 3600 * 24
}

export class Duration extends Quantity<DurationUnit, Duration> {
  protected baseUnit = DurationUnit.SECONDS

  protected convertValueToBaseUnit (value: number, unit: DurationUnit): number {
    return value * DISTANCE_MULTIPLIERS[unit]
  }

  protected convertBaseUnitValueTo (value: number, unit: DurationUnit): number {
    return value / DISTANCE_MULTIPLIERS[unit]
  }

  get nanoseconds (): number {
    return this.asNumber(DurationUnit.NANOSECONDS)
  }

  get milliseconds (): number {
    return this.asNumber(DurationUnit.MILLISECONDS)
  }

  get seconds (): number {
    return this.asNumber(DurationUnit.SECONDS)
  }

  get minutes (): number {
    return this.asNumber(DurationUnit.MINUTES)
  }

  get hours (): number {
    return this.asNumber(DurationUnit.HOURS)
  }

  /** @returns number of 24hr days */
  get days (): number {
    return this.asNumber(DurationUnit.DAYS)
  }
}
