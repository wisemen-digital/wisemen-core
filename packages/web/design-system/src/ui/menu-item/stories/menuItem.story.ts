import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import MenuItemPlayground from './MenuItemPlayground.vue'

const meta = {
  title: 'Components/MenuItem',
  tags: [
    'autodocs',
  ],
  component: MenuItemPlayground,
} satisfies Meta<typeof MenuItemPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const AllVariants: Story = {}
