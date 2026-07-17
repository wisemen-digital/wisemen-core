import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import { createAction } from '@wisemen/vue-core-actions'
import {
  Edit01Icon,
  Settings01Icon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'
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
    isDisabled: {
      control: 'boolean',
      description: 'Whether the badge is disabled',
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
        'neutral',
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
    isDisabled: false,
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

export const WithActions: Story = {
  args: {
    color: 'brand',
    label: 'Status',
    size: 'md',
    variant: 'translucent',
  },
  render: (args) => ({
    components: {
      BadgePlayground,
    },
    setup() {
      const actions = [
        createAction({
          id: 'badge-story-edit',
          name: () => 'Edit',
          availableWhenUnauthenticated: true,
          execute: () => {},
          icon: () => Edit01Icon,
        }),
        createAction({
          id: 'badge-story-settings',
          name: () => 'Settings',
          availableWhenUnauthenticated: true,
          execute: () => {},
          icon: () => Settings01Icon,
        }),
        createAction({
          id: 'badge-story-delete',
          name: () => 'Delete',
          availableWhenUnauthenticated: true,
          execute: () => {},
          icon: () => Trash01Icon,
        }),
      ]

      return {
        actions,
        args,
      }
    },
    template: '<BadgePlayground v-bind="args" />',
  }),
}
