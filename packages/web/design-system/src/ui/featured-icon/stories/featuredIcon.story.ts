import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import FeaturedIconPlayground from './FeaturedIconPlayground.vue'

const meta = {
  title: 'Components/FeaturedIcon',
  argTypes: {
    color: {
      control: 'select',
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

export const Translucent: Story = {
  args: {
    color: 'gray',
    variant: 'translucent',
  },
}

export const Outline: Story = {
  args: {
    color: 'gray',
    variant: 'outline',
  },
}
