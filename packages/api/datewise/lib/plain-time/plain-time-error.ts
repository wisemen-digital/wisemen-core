import { STRING_FORMAT } from './constants.js'
import { PlainTimeImpl } from './plain-time.js'

export class PlainTimeError extends Error {
}

export class InvalidPlainTimeString extends PlainTimeError {
  constructor (invalidString: string) {
    super(`Invalid time string: ${invalidString} must match ${STRING_FORMAT}`)
  }
}

export class InvalidBounds extends PlainTimeError {
  constructor (lowerBound: PlainTimeImpl, upperBound: PlainTimeImpl) {
    super(`Invalid boundaries: ${lowerBound.toString()} must be before ${upperBound.toString()}`)
  }
}

export class InvalidAbsoluteMilliseconds extends PlainTimeError {
  constructor (time: string) {
    super(`Invalid time ${time}`)
  }
}
