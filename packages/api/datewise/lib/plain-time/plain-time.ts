import { Duration, DurationUnit } from '@wisemen/quantity'
import { MILLIS_PER_HOUR, MILLIS_PER_MINUTE, MILLIS_PER_SECOND } from '../common/constants.js'
import { InclusivityString } from '../common/inclusivity.js'
import { DayjsPlainDate } from '../plain-date/dayjs-plain-date.js'
import { Timestamp } from '../timestamp/timestamp.js'
import { TimezoneInput } from '../common/timezone.js'
import { InvalidAbsoluteMilliseconds, InvalidBounds, InvalidPlainTimeString } from './plain-time-error.js'
import { PlainTimeObject } from './plain-time-object.type.js'
import { isValidTimeString } from './is-valid-time-string.js'
import { plainTime } from './plain-time-entry.js'
import { MIN_ABSOLUTE_MILLISECONDS, MAX_ABSOLUTE_MILLISECONDS } from './constants.js'

export type PlainTimeInput = number | string | PlainTimeImpl | PlainTimeObject | Date
  | { toDate: () => Date } | undefined

export type PlainTime = PlainTimeImpl

export class PlainTimeImpl {
  private absoluteMilliseconds: number

  constructor ()
  constructor (timeString: string)
  constructor (date: Date)
  constructor (timeObject: PlainTimeObject)
  constructor (absoluteMilliSeconds: number)
  constructor (transformable: { toDate: () => Date })
  constructor (target: PlainTimeInput)
  constructor (target?: PlainTimeInput) {
    let absoluteMilliseconds: number

    if (target === undefined) {
      target = new Date()
    }

    if (typeof target === 'string') {
      if (!isValidTimeString(target)) {
        throw new InvalidPlainTimeString(target)
      }

      // Parse formats like hh:mm:ss.sss, hh:mm:ss and hh:mm
      const timeParts = target.split(':')
      let hours: string, minutes: string, secondsWithMs: string

      if (timeParts.length === 3) {
        [hours, minutes, secondsWithMs] = timeParts
      } else if (timeParts.length === 2) {
        [hours, minutes] = timeParts
        secondsWithMs = '0'
      } else {
        throw new InvalidPlainTimeString(target)
      }

      let seconds = 0, milliseconds = 0

      if (secondsWithMs.includes('.')) {
        const [sec, ms] = secondsWithMs.split('.')

        seconds = parseInt(sec)
        milliseconds = parseInt(ms.padEnd(3, '0').slice(0, 3)) // Ensures ms is 3 digits
      } else {
        seconds = parseInt(secondsWithMs)
      }

      absoluteMilliseconds = this.calculateAbsoluteMilliseconds(
        parseInt(hours),
        parseInt(minutes),
        seconds,
        milliseconds
      )
    } else if (typeof target === 'number') {
      absoluteMilliseconds = target
    } else if (target instanceof Date) {
      absoluteMilliseconds = this.calculateAbsoluteMilliseconds(
        target.getHours(),
        target.getMinutes(),
        target.getSeconds(),
        target.getMilliseconds()
      )
    } else if (target instanceof PlainTimeImpl) {
      absoluteMilliseconds = target.absoluteMilliseconds
    } else if ('toDate' in target) {
      target = target.toDate()
      absoluteMilliseconds = this.calculateAbsoluteMilliseconds(
        target.getHours(),
        target.getMinutes(),
        target.getSeconds(),
        target.getMilliseconds()
      )
    } else if (typeof target === 'object') {
      absoluteMilliseconds = this.calculateAbsoluteMilliseconds(
        target.hours,
        target.minutes,
        target.seconds,
        target.milliseconds
      )
    } else {
      throw new Error('Invalid arguments')
    }

    this.absoluteMilliseconds = absoluteMilliseconds
    this.validateAbsoluteMilliseconds()
  }

  toString (): string {
    return this.format()
  }

  toJSON (): string {
    return this.format()
  }

  format (format: 'hh:mm:ss' | 'hh:mm' | 'hh:mm:ss.SSS' = 'hh:mm:ss.SSS'): string {
    const hours = this.hours().toString().padStart(2, '0')
    const minutes = this.minutes().toString().padStart(2, '0')
    const seconds = this.seconds().toString().padStart(2, '0')
    const milliseconds = this.milliseconds().toString().padStart(3, '0')

    if (format === 'hh:mm') {
      return `${hours}:${minutes}`
    } else if (format === 'hh:mm:ss') {
      return `${hours}:${minutes}:${seconds}`
    } else {
      return `${hours}:${minutes}:${seconds}.${milliseconds}`
    }
  }

  isBefore (other: PlainTimeInput): boolean {
    other = plainTime(other)

    return this.absoluteMilliseconds < other.absoluteMilliseconds
  }

  isSameOrBefore (other: PlainTimeInput): boolean {
    return this.isBefore(other) || this.isSame(other)
  }

  isAfter (other: PlainTimeInput): boolean {
    other = plainTime(other)

    return this.absoluteMilliseconds > other.absoluteMilliseconds
  }

  isSameOrAfter (other: PlainTimeInput): boolean {
    return this.isAfter(other) || this.isSame(other)
  }

  /**
   * @param lowerBound must be before or same as upperBound
   * @param upperBound must be after or same as lowerBound
   * @throws InvalidBounds
   */
  isBetween (
    lowerBound: PlainTimeInput,
    upperBound: PlainTimeInput,
    inclusivity: InclusivityString = '[]'
  ): boolean {
    lowerBound = plainTime(lowerBound)
    upperBound = plainTime(upperBound)

    if (lowerBound.isAfter(upperBound)) {
      throw new InvalidBounds(lowerBound, upperBound)
    }

    switch (inclusivity) {
      case '[]': return this.isSameOrAfter(lowerBound) && this.isSameOrBefore(upperBound)
      case '[)': return this.isSameOrAfter(lowerBound) && this.isBefore(upperBound)
      case '(]': return this.isAfter(lowerBound) && this.isSameOrBefore(upperBound)
      case '()': return this.isAfter(lowerBound) && this.isBefore(upperBound)
      default: return inclusivity
    }
  }

  isSame (other: PlainTimeInput): boolean {
    other = plainTime(other)

    return this.absoluteMilliseconds === other.absoluteMilliseconds
  }

  hours (): number {
    return Math.floor(this.absoluteMilliseconds / MILLIS_PER_HOUR)
  }

  minutes (): number {
    return Math.floor((this.absoluteMilliseconds % MILLIS_PER_HOUR) / MILLIS_PER_MINUTE)
  }

  seconds (): number {
    return Math.floor((this.absoluteMilliseconds % MILLIS_PER_MINUTE) / MILLIS_PER_SECOND)
  }

  milliseconds (): number {
    return this.absoluteMilliseconds % MILLIS_PER_SECOND
  }

  /**
   * Add a duration to this time, wrapping around the clock if necessary.
   * @example 23:00:00 + 2 hours = 01:00:00
   * @example 10:30:00 + 30 minutes = 11:00:00
   */
  add (duration: Duration): PlainTimeImpl {
    const newTime = (this.absoluteMilliseconds + duration.milliseconds) % (24 * MILLIS_PER_HOUR)

    return new PlainTimeImpl(newTime >= 0 ? newTime : newTime + 24 * MILLIS_PER_HOUR)
  }

  /**
   * Subtract a duration from this time, wrapping around the clock if necessary.
   * @example 01:00:00 - 2 hours = 23:00:00
   * @example 10:30:00 - 30 minutes = 10:00:00
   */
  subtract (duration: Duration): PlainTimeImpl {
    const newTime = (this.absoluteMilliseconds - duration.milliseconds) % (24 * MILLIS_PER_HOUR)

    return new PlainTimeImpl(newTime >= 0 ? newTime : newTime + 24 * MILLIS_PER_HOUR)
  }

  /**
   * Get the time that has elapsed since a previous time up until this time as a duration.
   * The duration represents the wall clock time duration. This means that the duration wraps
   * around the clock.
   * @example duration between 02h00 and 03h00 is 1 hour
   * @example duration between 03h00 and 02h00 is 23 hours
   */
  since (other: PlainTimeInput): Duration {
    other = plainTime(other)

    let timeSpan: number

    if (other.isAfter(this)) {
      timeSpan = (this.absoluteMilliseconds + 24 * MILLIS_PER_HOUR) - other.absoluteMilliseconds
    } else {
      timeSpan = this.absoluteMilliseconds - other.absoluteMilliseconds
    }

    return new Duration(timeSpan, DurationUnit.MILLISECONDS)
  }

  /**
   * Get the time until a future time as a duration.
   * The duration represents the wall clock time duration. This means that the duration wraps
   * around the clock.
   * @example duration between 02h00 and 03h00 is 1 hour
   * @example duration between 03h00 and 02h00 is 23 hours
   */
  until (other: PlainTimeInput): Duration {
    other = plainTime(other)

    let timeSpan: number

    if (other.isBefore(this)) {
      timeSpan = (other.absoluteMilliseconds + 24 * MILLIS_PER_HOUR) - this.absoluteMilliseconds
    } else {
      timeSpan = other.absoluteMilliseconds - this.absoluteMilliseconds
    }

    return new Duration(timeSpan, DurationUnit.MILLISECONDS)
  }

  toPlainObject (): PlainTimeObject {
    return {
      hours: this.hours(),
      minutes: this.minutes(),
      seconds: this.seconds(),
      milliseconds: this.milliseconds()
    }
  }

  copy (): PlainTimeImpl {
    return new PlainTimeImpl(this.toPlainObject())
  }

  toTimestamp (withDate: DayjsPlainDate, timeZone: TimezoneInput): Timestamp {
    return withDate.toTimestamp(this, timeZone)
  }

  private calculateAbsoluteMilliseconds (
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
  ): number {
    return hours * MILLIS_PER_HOUR
      + minutes * MILLIS_PER_MINUTE
      + seconds * MILLIS_PER_SECOND
      + milliseconds
  }

  private validateAbsoluteMilliseconds (): void {
    if (!(MIN_ABSOLUTE_MILLISECONDS <= this.absoluteMilliseconds
      && this.absoluteMilliseconds <= MAX_ABSOLUTE_MILLISECONDS)) {
      throw new InvalidAbsoluteMilliseconds(this.toString())
    }
  }
}
