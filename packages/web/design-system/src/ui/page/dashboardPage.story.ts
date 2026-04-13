import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import Playground from '@/ui/page/DashboardPagePlayground.vue'

const meta = {
  title: 'Components/Dashboard Page',
  tags: [
    'autodocs',
  ],
  component: Playground,
} satisfies Meta<typeof Playground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
