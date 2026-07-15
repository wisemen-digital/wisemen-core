import type {
  Locator,
  Page,
} from '@playwright/test'
import { expect } from '@playwright/test'

interface DateValue {
  day: string
  month: string
  year: string
}

interface TimeValue {
  hour: string
  minute: string
}

interface DateTimeValue {
  date: DateValue
  time: TimeValue
}

abstract class FormField {
  label: string
  locator: Locator

  constructor(locator: Locator, label: string) {
    this.locator = locator
    this.label = label
  }

  async expectToBeDisabled(): Promise<void> {
    await expect(this.locator.getByLabel(this.label, {
      exact: true,
    })).toBeDisabled()
  }

  async expectToBeEnabled(): Promise<void> {
    await expect(this.locator.getByLabel(this.label, {
      exact: true,
    })).toBeEnabled()
  }

  /**
   *  Fills the form field with the given value.
   * @param value The value to fill the form field with.
   * @returns A promise that resolves when the action is complete.
   */
  abstract fill(value: unknown): Promise<void>

  /**
   * Gets the value of the form field.
   * @returns A promise that resolves to the value of the form field.
   */
  abstract getValue(): Promise<unknown>
}

class TextField extends FormField {
  async fill(value: string): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).fill(value)
  }

  async getValue(): Promise<string> {
    return await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
  }
}

class DateField extends FormField {
  async fill(value?: DateValue): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).focus()

    if (value === undefined) {
      await this.locator.page().keyboard.press('ArrowUp')
      await this.locator.page().keyboard.press('Tab')
      await this.locator.page().keyboard.press('ArrowUp')
      await this.locator.page().keyboard.press('Tab')
      await this.locator.page().keyboard.press('ArrowUp')
    }
    else {
      await this.locator.page().keyboard.type(value.month)
      await this.locator.page().keyboard.type(value.day)
      await this.locator.page().keyboard.type(value.year)
    }
  }

  async getValue(): Promise<DateValue> {
    const inputValue = await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
    const [
      year,
      month,
      day,
    ] = inputValue.split('-')

    if (year === undefined || month === undefined || day === undefined) {
      throw new Error(`Could not parse date value from input: ${inputValue}`)
    }

    return {
      day,
      month,
      year,
    }
  }
}

class TimeField extends FormField {
  async fill(value: TimeValue): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).focus()
    await this.locator.page().keyboard.type(value.hour)
    await this.locator.page().keyboard.type(value.minute)
  }

  async getValue(): Promise<TimeValue> {
    const inputValue = await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
    const [
      hour,
      minute,
    ] = inputValue.split(':')

    if (hour === undefined || minute === undefined) {
      throw new Error(`Could not parse time value from input: ${inputValue}`)
    }

    return {
      hour,
      minute,
    }
  }
}

class PinInputField extends FormField {
  async fill(value: string): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).fill(value)
  }

  async getValue(): Promise<string> {
    return await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
  }
}

class SelectField extends FormField {
  async fill(value: string): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).click()
    await this.locator.page().getByRole('option', {
      name: value,
    }).click()
  }

  async getValue(): Promise<string> {
    return await this.locator.getByRole('combobox', {
      name: this.label,
    }).textContent() || ''
  }
}

class AutocompleteField extends FormField {
  async fill(value: string): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).click()
    await this.locator.page().getByRole('option', {
      name: value,
    }).click()
  }

  async getValue(): Promise<string> {
    return await this.locator.getByRole('combobox', {
      name: this.label,
    }).textContent() || ''
  }
}

class CheckboxField extends FormField {
  async fill(value: boolean): Promise<void> {
    const checkbox = this.locator.getByRole('checkbox', {
      name: this.label,
    })

    if (value) {
      await checkbox.check()
    }
    else {
      await checkbox.uncheck()
    }
  }

  async getValue(): Promise<boolean> {
    const checkbox = this.locator.getByRole('checkbox', {
      name: this.label,
    })

    return await checkbox.isChecked()
  }
}

class TextareaField extends FormField {
  async fill(value: string): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).fill(value)
  }

  async getValue(): Promise<string> {
    return await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
  }
}

class EmailField extends FormField {
  async fill(value: string): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).fill(value)
  }

  async getValue(): Promise<string> {
    return await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
  }
}

class PasswordField extends FormField {
  async fill(value: string): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).fill(value)
  }

  async getValue(): Promise<string> {
    return await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
  }
}

class NumberField extends FormField {
  async fill(value: string): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).fill(value)
  }

  async getValue(): Promise<string> {
    return await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
  }
}

class SwitchField extends FormField {
  async fill(value: boolean): Promise<void> {
    const switchControl = this.locator.getByRole('switch', {
      name: this.label,
    })

    if (value) {
      await switchControl.check()
    }
    else {
      await switchControl.uncheck()
    }
  }

  async getValue(): Promise<boolean> {
    const switchControl = this.locator.getByRole('switch', {
      name: this.label,
    })

    return await switchControl.isChecked()
  }
}

class RadioField extends FormField {
  async fill(value: string): Promise<void> {
    await this.locator.getByRole('radio', {
      name: value,
    }).click()
  }

  async getValue(): Promise<string> {
    const radios = await this.locator.getByRole('radio').all()

    for (const radio of radios) {
      const isChecked = await radio.isChecked()

      if (isChecked) {
        const ariaLabel = await radio.getAttribute('aria-label')
        const textContent = await radio.textContent()

        return ariaLabel ?? textContent ?? ''
      }
    }

    return ''
  }
}

class MultiSelectField extends FormField {
  async fill(values: string[]): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).click()

    for (const value of values) {
      await this.locator.page().getByRole('option', {
        name: value,
      }).click()
    }
  }

  async getValue(): Promise<string> {
    return await this.locator.getByRole('combobox', {
      name: this.label,
    }).textContent() || ''
  }
}

class FileUploadField extends FormField {
  async fill(value: string | string[]): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).setInputFiles(value)
  }

  async getValue(): Promise<string> {
    return await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
  }
}

class DateTimeField extends FormField {
  async fill(value: DateTimeValue): Promise<void> {
    await this.locator.getByLabel(this.label, {
      exact: true,
    }).focus()
    await this.locator.page().keyboard.type(value.date.month)
    await this.locator.page().keyboard.type(value.date.day)
    await this.locator.page().keyboard.type(value.date.year)
    await this.locator.page().keyboard.type(value.time.hour)
    await this.locator.page().keyboard.type(value.time.minute)
  }

  async getValue(): Promise<string> {
    return await this.locator.getByLabel(this.label, {
      exact: true,
    }).inputValue()
  }
}

export class FormTestUtil {
  locator: Locator
  page: Page

  constructor(page: Page, locator: Locator = page.locator('form')) {
    this.page = page
    this.locator = locator
  }

  getAutocompleteFieldByLabel(label: string): AutocompleteField {
    return new AutocompleteField(this.locator, label)
  }

  /**
   * Returns the button with the given text.
   */
  getButtonByText(text: string): Locator {
    return this.page.getByRole('button', {
      name: text,
    })
  }

  getCheckboxFieldByLabel(label: string): CheckboxField {
    return new CheckboxField(this.locator, label)
  }

  getDateFieldByLabel(label: string): DateField {
    return new DateField(this.locator, label)
  }

  getDateTimeFieldByLabel(label: string): DateTimeField {
    return new DateTimeField(this.locator, label)
  }

  getEmailFieldByLabel(label: string): EmailField {
    return new EmailField(this.locator, label)
  }

  getFileUploadFieldByLabel(label: string): FileUploadField {
    return new FileUploadField(this.locator, label)
  }

  getMultiSelectFieldByLabel(label: string): MultiSelectField {
    return new MultiSelectField(this.locator, label)
  }

  getNumberFieldByLabel(label: string): NumberField {
    return new NumberField(this.locator, label)
  }

  getPasswordFieldByLabel(label: string): PasswordField {
    return new PasswordField(this.locator, label)
  }

  getPinInputFieldByLabel(label: string): PinInputField {
    return new PinInputField(this.locator, label)
  }

  getRadioFieldByLabel(label: string): RadioField {
    return new RadioField(this.locator, label)
  }

  getSelectFieldByLabel(label: string): SelectField {
    return new SelectField(this.locator, label)
  }

  getSwitchFieldByLabel(label: string): SwitchField {
    return new SwitchField(this.locator, label)
  }

  getTextareaFieldByLabel(label: string): TextareaField {
    return new TextareaField(this.locator, label)
  }

  getTextFieldByLabel(label: string): TextField {
    return new TextField(this.locator, label)
  }

  getTimeFieldByLabel(label: string): TimeField {
    return new TimeField(this.locator, label)
  }

  async submit(): Promise<void> {
    const formId = await this.locator.getAttribute('id')
    const formSubmitButton = this.page.locator(`[form="${formId}"]`)

    await expect(formSubmitButton).toHaveCount(1)

    await formSubmitButton.click()
  }

  async submitAndExpectSuccessfulResponse(
    _url: string,
    _requestBody: Record<string, unknown>,
  ): Promise<void> {
    await this.submit()
  }
}
