import { PlainTimeInput, PlainTime } from './plain-time.js'
import { factory } from './plain-time.factory.js'
import { isValidTimeString } from './is-valid-time-string.js'
import { min } from './min.js'
import { max } from './max.js'
import { STRING_FORMAT } from './constants.js'
import { PlainTimeObject } from './plain-time-object.type.js'

export interface PlainTimeFn {
  (): PlainTime
  (arg: null): null
  (arg: undefined): PlainTime
  (arg: number): PlainTime
  (arg: string): PlainTime
  (arg: PlainTime): PlainTime
  (arg: PlainTimeObject): PlainTime
  (arg: Date): PlainTime
  (arg: PlainTimeInput): PlainTime
  (arg: PlainTimeInput | null): PlainTime | null
  (arg?: PlainTimeInput | null): PlainTime | null

  isValidTimeString(value?: string | null): boolean
  max (...times: PlainTimeInput[]): PlainTime
  min (...times: PlainTimeInput[]): PlainTime
  STRING_FORMAT: typeof STRING_FORMAT
}

export const plainTime = factory as unknown as PlainTimeFn

plainTime.isValidTimeString = isValidTimeString
plainTime.min = min
plainTime.max = max
plainTime.STRING_FORMAT = STRING_FORMAT
