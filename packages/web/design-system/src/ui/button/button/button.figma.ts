/**
 * Figma Code Connect — UIButton
 *
 * Figma library : Crispy Design Library
 * Figma component: Buttons/Button  (key: 5964facf947cb0b8165a4f832ff21b66f150e1dc)
 *
 * HOW TO GET THE NODE ID (one-time step):
 *   1. Open https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library
 *   2. In the Assets panel, right-click "Buttons/Button" → Copy link
 *   3. The URL contains ?node-id=XXXX-YYYY — convert the dash to a colon: XXXX:YYYY
 *   4. Replace REPLACE_WITH_BUTTON_NODE_ID below with that value
 * OR run: pnpm figma:create --figma-url "https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library"
 * which auto-generates stubs with the correct node IDs already filled in.
 */

import figma, { html } from '@figma/code-connect'

import type { UIButtonProps } from '@wisemen/vue-core-design-system'

figma.connect(
  'https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=3287:427074',
  {
    props: {
      /**
       * The Figma "Hierarchy" variant maps to the code `variant` prop.
       * Adjust these keys to match the exact names shown in Figma's right panel.
       */
      variant: figma.enum('Hierarchy', {
        'Primary': 'primary',
        'Secondary gray': 'secondary',
        'Secondary color': 'secondary',
        'Tertiary gray': 'tertiary',
        'Tertiary color': 'minimal-color',
        'Destructive primary': 'destructive-primary',
        'Destructive secondary': 'destructive-secondary',
        'Destructive tertiary': 'destructive-tertiary',
      } satisfies Record<string, UIButtonProps['variant']>),

      size: figma.enum('Size', {
        'xs': 'xs',
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg',
      } satisfies Record<string, UIButtonProps['size']>),

      isDisabled: figma.boolean('Disabled'),
      isLoading: figma.boolean('Loading'),

      label: figma.string('Label'),
    },

    example: ({ variant, size, isDisabled, isLoading, label }) => html`
      <UIButton
        variant="${variant}"
        size="${size}"
        label="${label}"
        :is-disabled="${isDisabled}"
        :is-loading="${isLoading}"
      />
    `,

    imports: ["import { UIButton } from '@wisemen/vue-core-design-system'"],
  },
)
