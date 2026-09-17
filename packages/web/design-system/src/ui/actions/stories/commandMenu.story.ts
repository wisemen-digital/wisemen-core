import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import CommandMenuPlayground from './CommandMenuPlayground.vue'

const meta = {
  title: 'Components/CommandMenu',
  tags: [
    'autodocs',
  ],
  component: CommandMenuPlayground,
} satisfies Meta<typeof CommandMenuPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
