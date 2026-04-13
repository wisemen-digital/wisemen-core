import { DateTimeRange } from '../date-time-range/date-time-range.js'
import { factory, RRuleOptions } from './rrule.factory.js'
import { RRule } from './rrule.js'
import { once, RRuleOnceOptions } from './rrule.once.js'

export * from './frequency.js'
export * from './typeorm/index.js'
export { RRule } from './rrule.js'

export interface RRuleFn {
  (options: null): null
  (options: RRuleOptions): RRule
  (options: RRuleOptions | null): RRule | null

  once(range: DateTimeRange): RRule
  once(options: RRuleOnceOptions): RRule
  once(options: DateTimeRange | RRuleOnceOptions): RRule
}

export const rrule = factory as RRuleFn

rrule.once = once
