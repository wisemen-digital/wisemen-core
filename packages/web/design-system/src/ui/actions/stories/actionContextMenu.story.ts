import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import ActionContextMenuPlayground from './ActionContextMenuPlayground.vue'

const meta = {
  title: 'Components/ActionContextMenu',
  tags: [
    'autodocs',
  ],
  component: ActionContextMenuPlayground,
} satisfies Meta<typeof ActionContextMenuPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
