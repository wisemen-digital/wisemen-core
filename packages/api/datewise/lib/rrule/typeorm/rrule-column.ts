import { Column } from 'typeorm'
import { ColumnEmbeddedOptions } from 'typeorm/decorator/options/ColumnEmbeddedOptions.js'
import { RRuleImpl } from '../rrule.js'

export function RRuleColumn (options?: ColumnEmbeddedOptions): PropertyDecorator {
  return Column(() => RRuleImpl, options)
}
