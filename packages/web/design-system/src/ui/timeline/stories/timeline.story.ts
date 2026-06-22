import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import TimelineAllVariantsPlayground from './TimelineAllVariantsPlayground.vue'
import TimelinePlayground from './TimelinePlayground.vue'

const meta = {
  title: 'Components/Timeline',
  argTypes: {
    size: {
      control: 'select',
      description: 'Controls the size of the timeline indicators and spacing',
      options: [
        'sm',
        'md',
      ],
    },
    variant: {
      control: 'select',
      description: 'Visual style applied to the timeline indicators',
      options: [
        'outline',
        'solid',
        'subtle',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: TimelinePlayground,
} satisfies Meta<typeof TimelinePlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'solid',
  },
}

export const AllVariants: Story = {
  parameters: {
    controls: {
      exclude: [
        'size',
        'variant',
      ],
    },
  },
  render: () => ({
    components: {
      TimelineAllVariantsPlayground,
    },
    template: '<TimelineAllVariantsPlayground />',
  }),
}
