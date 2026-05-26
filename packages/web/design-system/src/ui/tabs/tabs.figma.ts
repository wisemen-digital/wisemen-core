/**
 * Figma Code Connect — UITabs
 *
 * Figma library : Crispy Design Library
 * Figma component: Horizontal tabs  (key: 6c244a6bdd210c6e1f6e1d0d95174b9b2b2e6422)
 */

import figma, { html } from '@figma/code-connect'

import type { TabsProps } from '@wisemen/vue-core-design-system'

figma.connect(
  'https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=REPLACE_WITH_TABS_NODE_ID',
  {
    props: {
      variant: figma.enum('Type', {
        'Underline': 'underline',
        'Button border': 'button-border',
        'Button brand': 'button-brand',
      } satisfies Record<string, TabsProps['variant']>),
    },

    example: ({ variant }) => html`
      <UITabs
        v-model="activeTab"
        variant="${variant}"
        :items="tabs"
      >
        <template #default="{ item }">
          {{ item.label }}
        </template>
      </UITabs>
    `,

    imports: ["import { UITabs } from '@wisemen/vue-core-design-system'"],
  },
)
