/**
 * Figma Code Connect — UITextField
 *
 * Figma library : Crispy Design Library
 * Figma component: Input field  (key: 6157b8adc841b76adeded05d013128197c1d2372)
 *
 * Get the node ID by right-clicking the component in Figma → Copy link.
 */

import figma, { html } from '@figma/code-connect'

import type { UITextFieldProps } from '@wisemen/vue-core-design-system'

figma.connect(
  'https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=1090:57817',
  {
    props: {
      size: figma.enum('Size', {
        'sm': 'sm',
        'md': 'md',
      } satisfies Record<string, UITextFieldProps['size']>),

      /**
       * Figma uses a "State" variant. The "Error" state maps to passing an
       * errorMessage prop. "Disabled" maps to isDisabled.
       */
      isDisabled: figma.boolean('Disabled'),
      hasError: figma.enum('State', {
        'Error': true,
        'Default': false,
        'Focused': false,
        'Filled': false,
      }),

      label: figma.string('Label'),
      placeholder: figma.string('Placeholder'),
    },

    example: ({ size, isDisabled, hasError, label, placeholder }) => html`
      <UITextField
        v-model="value"
        size="${size}"
        label="${label}"
        placeholder="${placeholder}"
        :error-message="${hasError} ? 'This field is required' : undefined"
        :is-disabled="${isDisabled}"
      />
    `,

    imports: ["import { UITextField } from '@wisemen/vue-core-design-system'"],
  },
)
