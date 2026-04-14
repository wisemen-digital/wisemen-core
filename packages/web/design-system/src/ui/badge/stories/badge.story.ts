import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  within,
} from 'storybook/test'

import BadgePlayground from './BadgePlayground.vue'
import BadgeVariantPlayground from './BadgeVariantPlayground.vue'

const meta = {
  title: 'Components/Badge',
  argTypes: {
    hasDot: {
      control: 'boolean',
    },
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
    label: {
      control: 'text',
    },
    rounded: {
      control: 'select',
      options: [
        'default',
        'full',
      ],
    },
    size: {
      control: 'select',
      options: [
        'sm',
        'md',
        'lg',
      ],
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

export const Translucent: Story = {
  args: {
    color: 'gray',
  },
  render: (args) => ({
    components: {
      BadgeVariantPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<BadgeVariantPlayground v-bind="args" variant="translucent" />',
  }),
}

export const Outline: Story = {
  args: {
    color: 'gray',
  },
  render: (args) => ({
    components: {
      BadgeVariantPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<BadgeVariantPlayground v-bind="args" variant="outline" />',
  }),
}

export const Solid: Story = {
  args: {
    color: 'gray',
  },
  render: (args) => ({
    components: {
      BadgeVariantPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<BadgeVariantPlayground v-bind="args" variant="solid" />',
  }),
}
