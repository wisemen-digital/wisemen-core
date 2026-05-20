import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import CenteredPagePlayground from '@/ui/dashboard-page/stories/DashboardCenteredPagePlayground.vue'
import CenteredPageScrollablePlayground from '@/ui/dashboard-page/stories/DashboardCenteredPageScrollablePlayground.vue'
import Playground from '@/ui/dashboard-page/stories/DashboardPagePlayground.vue'

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

export const CenteredPage: Story = {
  render: () => ({
    components: { CenteredPagePlayground },
    template: '<CenteredPagePlayground />',
  }),
}

export const CenteredPageScrollable: Story = {
  render: () => ({
    components: { CenteredPageScrollablePlayground },
    template: '<CenteredPageScrollablePlayground />',
  }),
}
