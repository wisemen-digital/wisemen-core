import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import BreadcrumbPlayground from '@/ui/breadcrumbs/stories/BreadcrumbPlayground.vue'
import BreadcrumbResponsivePlayground from '@/ui/breadcrumbs/stories/BreadcrumbResponsivePlayground.vue'

const meta = {
  title: 'Components/Breadcrumbs',
  tags: [
    'autodocs',
  ],
  component: BreadcrumbPlayground,
} satisfies Meta<typeof BreadcrumbPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Responsive: StoryObj<typeof BreadcrumbResponsivePlayground> = {
  render: () => ({
    components: {
      BreadcrumbResponsivePlayground,
    },
    template: '<BreadcrumbResponsivePlayground />',
  }),
}
