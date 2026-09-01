import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import ActionDropdownMenuPlayground from './ActionDropdownMenuPlayground.vue'

const meta = {
  title: 'Components/ActionDropdownMenu',
  tags: [
    'autodocs',
  ],
  component: ActionDropdownMenuPlayground,
} satisfies Meta<typeof ActionDropdownMenuPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
