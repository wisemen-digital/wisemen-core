import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  screen,
  userEvent,
  within,
} from 'storybook/test'

import ContextMenuPlayground from './ContextMenuPlayground.vue'
import ContextMenuSubmenuPlayground from './ContextMenuSubmenuPlayground.vue'

const meta = {
  title: 'Components/ContextMenu',
  tags: [
    'autodocs',
  ],
  component: ContextMenuPlayground,
} satisfies Meta<typeof ContextMenuPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const trigger = canvas.getByText('Right-click here')

    await userEvent.pointer({
      keys: '[MouseRight]',
      target: trigger,
    })

    const menu = await screen.findByRole('menu')

    await expect(menu).toBeVisible()

    const items = within(menu).getAllByRole('menuitem')

    await expect(items.length).toBeGreaterThan(0)
  },
}

export const WithSubmenus: Story = {
  render: (args) => ({
    components: {
      ContextMenuSubmenuPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<ContextMenuSubmenuPlayground v-bind="args" />',
  }),
}
