import { CustomFieldColumnValue, CustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { PlainDateTransformer, TimestampTransformer } from '@wisemen/datewise'
import { Currency, MoneyTypeOrmTransformer } from '@wisemen/monetary'
import { Column, ColumnOptions, type ValueTransformer } from 'typeorm'

const EMPTY_CURRENCY_LIST = {} as Record<Currency, never>
const PERSIST_PRECISION = true

interface CustomFieldValueColumnTransformers {
  plainDateTransformer: PlainDateTransformer
  timestampTransformer: TimestampTransformer
}

export function CustomFieldValueColumn(options?: Omit<ColumnOptions, 'type' | 'transformer' | 'nullable'>): PropertyDecorator {
  return Column({
    ...options,
    type: 'jsonb',
    transformer: new CustomFieldValueTransformer({
      plainDateTransformer: PlainDateTransformer.getInstance(),
      timestampTransformer: new TimestampTransformer()
    })
  })
}

class CustomFieldValueTransformer implements ValueTransformer {
  private plainDateTransformer: PlainDateTransformer
  private timestampTransformer: TimestampTransformer

  constructor(transformers: CustomFieldValueColumnTransformers) {
    this.plainDateTransformer = transformers.plainDateTransformer
    this.timestampTransformer = transformers.timestampTransformer
  }

  from(
    value: CustomFieldColumnValue | CustomFieldColumnValue[]
  ): CustomFieldValue | CustomFieldValue[] {
    if (Array.isArray(value)) {
      return value.map(v => this.parseCustomFieldValue(v))
    }

    return this.parseCustomFieldValue(value)
  }

  to(
    value: CustomFieldValue | CustomFieldValue[]
  ): CustomFieldColumnValue | CustomFieldColumnValue[] {
    if (Array.isArray(value)) {
      return value.map(v => this.getSerializeValue(v))
    }

    return this.getSerializeValue(value)
  }

  private getSerializeValue(columnValue: CustomFieldValue): CustomFieldColumnValue {
    switch (columnValue.type) {
      case CustomFieldType.TEXT:
      case CustomFieldType.TEXT_ARRAY:
      case CustomFieldType.NUMBER:
      case CustomFieldType.BOOLEAN:
      case CustomFieldType.SINGLE_SELECT:
      case CustomFieldType.MULTI_SELECT:
        return columnValue
      case CustomFieldType.DATE:
        return {
          ...columnValue,
          value: this.assertDefined(this.plainDateTransformer.to(columnValue.value))
        }
      case CustomFieldType.TIMESTAMP:
        return {
          ...columnValue,
          value: this.assertDefined(this.timestampTransformer.to(columnValue.value))
        }
      case CustomFieldType.MONETARY:
        return {
          ...columnValue,
          value: this.assertDefined(
            new MoneyTypeOrmTransformer(columnValue.value.precision, EMPTY_CURRENCY_LIST).to(columnValue.value, PERSIST_PRECISION))
        }
      default:
        return exhaustiveCheck(columnValue)
    }
  }

  private parseCustomFieldValue(column: CustomFieldColumnValue): CustomFieldValue {
    switch (column.type) {
      case CustomFieldType.TEXT:
      case CustomFieldType.TEXT_ARRAY:
      case CustomFieldType.NUMBER:
      case CustomFieldType.BOOLEAN:
      case CustomFieldType.SINGLE_SELECT:
      case CustomFieldType.MULTI_SELECT:
        return column
      case CustomFieldType.DATE:
        return {
          ...column,
          value: this.assertDefined(this.plainDateTransformer.from(column.value))
        }
      case CustomFieldType.TIMESTAMP:
        return {
          ...column,
          value: this.assertDefined(this.timestampTransformer.from(column.value))
        }
      case CustomFieldType.MONETARY: {
        const precision = this.assertDefined(column.value.precision)
        return {
          ...column,
          value: this.assertDefined(new MoneyTypeOrmTransformer(precision, EMPTY_CURRENCY_LIST).from(column.value))
        }
      }
      default:
        return exhaustiveCheck(column)
    }
  }

  private assertDefined<TValue>(value: TValue | null | undefined): TValue {
    if (value == null) {
      throw new Error('Expected transformed custom field value to be defined')
    }

    return value
  }
}
