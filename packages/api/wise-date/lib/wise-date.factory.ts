import { WiseDate } from './wise-date.js'
import { PastInfinityDate } from './past-infinity-date.js'
import { FutureInfinityDate } from './future-infinity-date.js'

export function wiseDate (): WiseDate
export function wiseDate (date: undefined): WiseDate
export function wiseDate (date: null): null
export function wiseDate (date: string): WiseDate
export function wiseDate (date?: string): WiseDate
export function wiseDate (date: number): WiseDate
export function wiseDate (date?: number): WiseDate
export function wiseDate (date: Date): WiseDate
export function wiseDate (date?: Date): WiseDate
export function wiseDate (date?: string | number | null | Date): WiseDate | null
export function wiseDate (date?: string | number | null | Date): WiseDate | null {
  switch (date) {
    case null: return null
    case undefined: return new WiseDate()
    case '-infinity': return new PastInfinityDate()
    case 'infinity': return new FutureInfinityDate()
    case '+infinity': return new FutureInfinityDate()
    case Infinity: return new FutureInfinityDate()
    case -Infinity: return new PastInfinityDate()
    default: return new WiseDate(date)
  }
}
