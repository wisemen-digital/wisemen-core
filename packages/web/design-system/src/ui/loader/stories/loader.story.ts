import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import LoaderPlayground from './LoaderPlayground.vue'
import LoaderSizesPlayground from './LoaderSizesPlayground.vue'

const meta = {
  title: 'Components/Loader',
  argTypes: {
    size: {
      control: 'select',
      description: 'Controls the rendered size of the loader',
      options: [
        'sm',
        'md',
        'lg',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: LoaderPlayground,
} satisfies Meta<typeof LoaderPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
  },
}

export const AllSizes: Story = {
  parameters: {
    controls: {
      exclude: [
        'size',
      ],
    },
  },
  render: () => ({
    components: {
      LoaderSizesPlayground,
    },
    template: '<LoaderSizesPlayground />',
  }),
}
