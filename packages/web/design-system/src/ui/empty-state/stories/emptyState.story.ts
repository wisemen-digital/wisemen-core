import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import EmptyStatePlayground from './EmptyStatePlayground.vue'

const meta = {
  title: 'Components/EmptyState',
  tags: [
    'autodocs',
  ],
  component: EmptyStatePlayground,
} satisfies Meta<typeof EmptyStatePlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
