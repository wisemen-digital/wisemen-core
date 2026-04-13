import { PlainTimeObject } from './plain-time-object.type.js'
import { PlainTime, PlainTimeImpl, PlainTimeInput } from './plain-time.js'

export function factory (arg: null): null
export function factory (arg?: undefined): PlainTime
export function factory (timeString: string): PlainTime
export function factory (date: Date): PlainTime
export function factory (timeObject: PlainTimeObject): PlainTime
export function factory (absoluteSeconds: number): PlainTime
export function factory (transformable: { toDate: () => Date }): PlainTime
export function factory (arg: PlainTimeInput): PlainTime
export function factory (arg: PlainTimeInput | null): PlainTime | null
export function factory (arg?: PlainTimeInput | null): PlainTime | null {
  if (arg === null || arg instanceof PlainTimeImpl) {
    return arg
  } else {
    return new PlainTimeImpl(arg)
  }
}
