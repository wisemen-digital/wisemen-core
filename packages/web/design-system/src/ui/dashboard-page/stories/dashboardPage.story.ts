import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import CenteredPagePlayground from '@/ui/dashboard-page/stories/DashboardCenteredPagePlayground.vue'
import CenteredPageScrollablePlayground from '@/ui/dashboard-page/stories/DashboardCenteredPageScrollablePlayground.vue'
import LongTitlePlayground from '@/ui/dashboard-page/stories/DashboardPageLongTitlePlayground.vue'
import Playground from '@/ui/dashboard-page/stories/DashboardPagePlayground.vue'

const meta = {
  title: 'Components/Dashboard Page',
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'branded',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: Playground,
} satisfies Meta<typeof Playground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
  },
}

export const CenteredPage: Story = {
  render: () => ({
    components: {
      CenteredPagePlayground,
    },
    template: '<CenteredPagePlayground />',
  }),
}

export const CenteredPageScrollable: Story = {
  render: () => ({
    components: {
      CenteredPageScrollablePlayground,
    },
    template: '<CenteredPageScrollablePlayground />',
  }),
}

export const LongTitle: Story = {
  render: () => ({
    components: {
      LongTitlePlayground,
    },
    template: '<LongTitlePlayground />',
  }),
}
