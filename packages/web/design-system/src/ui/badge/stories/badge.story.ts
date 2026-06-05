import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  within,
} from 'storybook/test'

import BadgeAllVariantsPlayground from './BadgeAllVariantsPlayground.vue'
import BadgePlayground from './BadgePlayground.vue'

const meta = {
  title: 'Components/Badge',
  argTypes: {
    hasDot: {
      control: 'boolean',
      description: 'Shows a dot indicator inside the badge',
    },
    color: {
      control: 'select',
      description: 'Color palette applied to the badge',
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
    label: {
      control: 'text',
      description: 'Text displayed inside the badge',
    },
    rounded: {
      control: 'select',
      description: 'Controls how rounded the badge corners appear',
      options: [
        'default',
        'full',
      ],
    },
    size: {
      control: 'select',
      description: 'Controls the badge size',
      options: [
        'sm',
        'md',
        'lg',
      ],
    },
    variant: {
      control: 'select',
      description: 'Visual style applied to the badge',
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
  component: BadgePlayground,
} satisfies Meta<typeof BadgePlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    hasDot: false,
    color: 'gray',
    label: 'Badge',
    rounded: 'default',
    size: 'md',
    variant: 'translucent',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)
    const badges = canvas.getAllByRole('status')

    await expect(badges.length).toBeGreaterThan(0)
    await expect(badges[0]).toHaveTextContent('Badge')
  },
}

export const AllVariants: Story = {
  args: {
    hasDot: false,
    label: 'Badge',
    rounded: 'default',
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
      BadgeAllVariantsPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<BadgeAllVariantsPlayground v-bind="args" />',
  }),
}
