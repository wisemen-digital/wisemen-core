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

import DropdownMenuFilterPlayground from './DropdownMenuFilterPlayground.vue'
import DropdownMenuPlayground from './DropdownMenuPlayground.vue'
import DropdownMenuSubmenuPlayground from './DropdownMenuSubmenuPlayground.vue'

const meta = {
  title: 'Components/DropdownMenu',
  tags: [
    'autodocs',
  ],
  component: DropdownMenuPlayground,
} satisfies Meta<typeof DropdownMenuPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const trigger = canvas.getByRole('button', {
      name: 'Open menu',
    })

    await userEvent.click(trigger)

    const menu = await screen.findByRole('menu')

    await expect(menu).toBeVisible()

    const items = within(menu).getAllByRole('menuitem')

    await expect(items.length).toBeGreaterThan(0)
  },
}

export const WithSubmenus: Story = {
  render: (args) => ({
    components: {
      DropdownMenuSubmenuPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<DropdownMenuSubmenuPlayground v-bind="args" />',
  }),
}

export const WithRadioAndCheckbox: Story = {
  render: (args) => ({
    components: {

      DropdownMenuFilterPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<DropdownMenuFilterPlayground v-bind="args" />',
  }),
}
