/**
 * Figma Code Connect — UIIconButton
 *
 * Figma library : Crispy Design Library
 * Figma component: Buttons/Button utility  (key: 1f119209919db7c768011c89dc6689400a37ee45)
 *
 * Get the node ID by right-clicking the component in Figma → Copy link.
 */

import figma, { html } from '@figma/code-connect'

import type { IconButtonProps } from '@wisemen/vue-core-design-system'

figma.connect(
  'https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=REPLACE_WITH_ICON_BUTTON_NODE_ID',
  {
    props: {
      variant: figma.enum('Hierarchy', {
        'Primary': 'primary',
        'Secondary': 'secondary',
        'Tertiary': 'tertiary',
        'Destructive primary': 'destructive-primary',
        'Destructive tertiary': 'destructive-tertiary',
      } satisfies Record<string, IconButtonProps['variant']>),

      size: figma.enum('Size', {
        'xs': 'xs',
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg',
      } satisfies Record<string, IconButtonProps['size']>),

      isDisabled: figma.boolean('Disabled'),
      isLoading: figma.boolean('Loading'),
    },

    example: ({ variant, size, isDisabled, isLoading }) => html`
      <UIIconButton
        variant="${variant}"
        size="${size}"
        label="Action"
        :icon="SomeIcon"
        :is-disabled="${isDisabled}"
        :is-loading="${isLoading}"
      />
    `,

    imports: [
      "import { UIIconButton } from '@wisemen/vue-core-design-system'",
      "import SomeIcon from '@wisemen/vue-core-icons'",
    ],
  },
)
