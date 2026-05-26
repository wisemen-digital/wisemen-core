/**
 * Figma Code Connect — UIBadge
 *
 * Figma library : Crispy Design Library
 * Figma component: Badge  (search for "badge" in Crispy Design Library)
 *
 * Get the node ID by right-clicking the component in Figma → Copy link.
 * https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=1046-3819&t=JyPWayfiS2YQ678R-4
 */

import figma, { html } from '@figma/code-connect'

import type { BadgeProps } from '@wisemen/vue-core-design-system'

figma.connect(
  'https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=1046:3819',
  {
    props: {
      color: figma.enum('Color', {
        'Brand': 'brand',
        'Gray': 'gray',
        'Error': 'error',
        'Warning': 'warning',
        'Success': 'success',
        'Blue': 'blue',
        'Pink': 'pink',
        'Purple': 'purple',
      } satisfies Record<string, BadgeProps['color']>),

      variant: figma.enum('Type', {
        'Solid': 'solid',
        'Translucent': 'translucent',
        'Outline': 'outline',
      } satisfies Record<string, BadgeProps['variant']>),

      size: figma.enum('Size', {
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg',
      } satisfies Record<string, BadgeProps['size']>),

      label: figma.string('Label'),
    },

    example: ({ color, variant, size, label }) => html`
      <UIBadge
        color="${color}"
        variant="${variant}"
        size="${size}"
        label="${label}"
      />
    `,

    imports: ["import { UIBadge } from '@wisemen/vue-core-design-system'"],
  },
)
