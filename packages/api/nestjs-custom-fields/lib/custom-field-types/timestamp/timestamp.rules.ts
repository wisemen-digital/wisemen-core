import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { TimestampCustomFieldTypeContract } from './timestamp.contract.js'

export type TimestampCustomFieldRules = { type: CustomFieldType.TIMESTAMP } & TimestampCustomFieldTypeContract['rules']
