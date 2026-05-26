/**
 * Figma Code Connect — UITextareaField
 *
 * Figma library : Crispy Design Library
 * Figma component: Textarea input field  (key: d2a43461028509784ec3360dd9131f12faf136b7)
 */

import figma, { html } from '@figma/code-connect'

figma.connect(
  'https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=1238:278',
  {
    props: {
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

    example: ({ isDisabled, hasError, label, placeholder }) => html`
      <UITextareaField
        v-model="value"
        label="${label}"
        placeholder="${placeholder}"
        :error-message="${hasError} ? 'This field is required' : undefined"
        :is-disabled="${isDisabled}"
      />
    `,

    imports: ["import { UITextareaField } from '@wisemen/vue-core-design-system'"],
  },
)
