import { Column, type ColumnOptions, type ValueTransformer } from 'typeorm'
import { LocalizedStringTransformer, type LocalizedValue } from '@wisemen/localized-string'
import { CustomFieldChoice } from '#src/custom-field-choice.js'

type PersistedCustomFieldChoice = {
  value: string
  label: LocalizedValue[]
  order: number
}

const localizedStringTransformer = LocalizedStringTransformer.getInstance()

class CustomFieldChoiceTransformer implements ValueTransformer {
  to(
    value: CustomFieldChoice | CustomFieldChoice[]
  ): PersistedCustomFieldChoice | PersistedCustomFieldChoice[] {
    if (Array.isArray(value)) {
      return value.map(choice => this.toColumn(choice))
    }

    return this.toColumn(value)
  }

  from(
    value: PersistedCustomFieldChoice | PersistedCustomFieldChoice[]
  ): CustomFieldChoice | CustomFieldChoice[] {
    if (Array.isArray(value)) {
      return value.map(choice => this.fromColumn(choice))
    }

    return this.fromColumn(value)
  }

  private toColumn(value: CustomFieldChoice): PersistedCustomFieldChoice {
    return {
      ...value,
      label: this.assertDefined(localizedStringTransformer.to(value.label))
    }
  }

  private fromColumn(value: PersistedCustomFieldChoice): CustomFieldChoice {
    return {
      ...value,
      label: this.assertDefined(localizedStringTransformer.from(value.label))
    }
  }

  private assertDefined<TValue>(value: TValue | null | undefined): TValue {
    if (value == null) {
      throw new Error('Expected transformed custom field choice label to be defined')
    }

    return value
  }
}

export function CustomFieldChoiceColumn(
  options?: Omit<ColumnOptions, 'type' | 'transformer'>
): PropertyDecorator {
  return Column({
    ...options,
    type: 'jsonb',
    transformer: new CustomFieldChoiceTransformer()
  })
}
