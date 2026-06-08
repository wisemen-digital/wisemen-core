import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import NumberBadgePlayground from './NumberBadgePlayground.vue'

const meta = {
  title: 'Components/NumberBadge',
  argTypes: {
    color: {
      control: 'select',
      options: [
        'gray',
        'brand',
        'error',
        'success',
        'warning',
        'purple',
        'pink',
      ],
    },
    size: {
      control: 'select',
      options: [
        'md',
        'lg',
      ],
    },
    value: {
      control: 'number',
    },
    variant: {
      control: 'select',
      options: [
        'translucent',
        'outline',
        'solid',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: NumberBadgePlayground,
} satisfies Meta<typeof NumberBadgePlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    color: 'gray',
    size: 'md',
    value: 5,
    variant: 'translucent',
  },
}

export const Solid: Story = {
  args: {
    color: 'brand',
    size: 'md',
    value: 12,
    variant: 'solid',
  },
}

export const Outline: Story = {
  args: {
    color: 'error',
    size: 'md',
    value: 3,
    variant: 'outline',
  },
}

export const Large: Story = {
  args: {
    color: 'success',
    size: 'lg',
    value: 99,
    variant: 'translucent',
  },
}
