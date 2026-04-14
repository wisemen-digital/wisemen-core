import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import SeparatorPlayground from './SeparatorPlayground.vue'

const meta = {
  title: 'Components/Separator',
  tags: [
    'autodocs',
  ],
  component: SeparatorPlayground,
} satisfies Meta<typeof SeparatorPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
