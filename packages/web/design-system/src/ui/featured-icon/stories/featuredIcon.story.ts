import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import FeaturedIconAllVariantsPlayground from './FeaturedIconAllVariantsPlayground.vue'
import FeaturedIconPlayground from './FeaturedIconPlayground.vue'

const meta = {
  title: 'Components/FeaturedIcon',
  argTypes: {
    color: {
      control: 'select',
      description: 'Color palette applied to the featured icon',
      options: [
        'gray',
        'brand',
        'blue',
        'pink',
        'error',
        'success',
        'warning',
        'purple',
      ],
    },
    size: {
      control: 'select',
      description: 'Controls the overall size of the featured icon',
      options: [
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
      ],
    },
    variant: {
      control: 'select',
      description: 'Visual style applied to the featured icon',
      options: [
        'translucent',
        'outline',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: FeaturedIconPlayground,
} satisfies Meta<typeof FeaturedIconPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    color: 'gray',
    size: 'md',
    variant: 'translucent',
  },
}

export const AllVariants: Story = {
  args: {
    size: 'md',
  },
  parameters: {
    controls: {
      exclude: [
        'color',
        'variant',
      ],
    },
  },
  render: (args) => ({
    components: {
      FeaturedIconAllVariantsPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<FeaturedIconAllVariantsPlayground v-bind="args" />',
  }),
}
