import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import DetailListPlayground from './DetailListPlayground.vue'

const meta = {
  title: 'Components/DetailList',
  tags: [
    'autodocs',
  ],
  component: DetailListPlayground,
} satisfies Meta<typeof DetailListPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      DetailListPlayground,
    },
    template: '<DetailListPlayground />',
  }),
}
