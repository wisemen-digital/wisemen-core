import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import TimelinePlayground from './TimelinePlayground.vue'

const meta = {
  title: 'Components/Timeline',
  argTypes: {
    size: {
      control: 'select',
      options: [
        'sm',
        'md',
      ],
    },
    variant: {
      control: 'select',
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

export const Solid: Story = {
  args: {
    size: 'md',
    variant: 'solid',
  },
}

export const Outline: Story = {
  args: {
    size: 'md',
    variant: 'outline',
  },
}

export const Subtle: Story = {
  args: {
    size: 'md',
    variant: 'subtle',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'solid',
  },
}
