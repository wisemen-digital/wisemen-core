/**
 * Figma Code Connect — UIAvatar
 *
 * Figma library : Crispy Design Library
 * Figma component: Avatar profile photo  (key: 527480c6afaeb45eef9f66c333e128b5f24a8c89)
 */

import figma, { html } from '@figma/code-connect'

import type { AvatarProps } from '@wisemen/vue-core-design-system'

figma.connect(
  'https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=19:1012',
  {
    props: {
      size: figma.enum('Size', {
        'xxs': 'xxs',
        'xs': 'xs',
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg',
        'xl': 'xl',
        '2xl': '2xl',
      } satisfies Record<string, AvatarProps['size']>),
    },

    example: ({ size }) => html`
      <UIAvatar
        name="Jane Doe"
        size="${size}"
      />
    `,

    imports: ["import { UIAvatar } from '@wisemen/vue-core-design-system'"],
  },
)
