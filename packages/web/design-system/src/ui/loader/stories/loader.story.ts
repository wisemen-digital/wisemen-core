import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import LoaderPlayground from './LoaderPlayground.vue'

const meta = {
  title: 'Components/Loader',
  tags: [
    'autodocs',
  ],
  component: LoaderPlayground,
} satisfies Meta<typeof LoaderPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
