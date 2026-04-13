import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  within,
} from 'storybook/test'

import LinkIconsPlayground from './LinkIconsPlayground.vue'
import LinkPlayground from './LinkPlayground.vue'
import LinkSizesPlayground from './LinkSizesPlayground.vue'
import LinkStatesPlayground from './LinkStatesPlayground.vue'
import LinkVariantsPlayground from './LinkVariantsPlayground.vue'

const meta = {
  title: 'Components/Link',
  argTypes: {
    keyboardShortcut: {
      control: 'text',
      description: 'Visual representation of a keyboard shortcut (e.g. "⌘K")',
    },
    label: {
      control: 'text',
      description: 'Text label displayed inside the link',
    },
    size: {
      control: 'select',
      description: 'Controls the link size',
      options: [
        'xs',
        'sm',
        'md',
        'lg',
      ],
    },
    tooltipLabel: {
      control: 'text',
      description: 'Tooltip text shown on hover or focus',
    },
    tooltipSide: {
      control: 'select',
      description: 'Position of the tooltip relative to the link',
      options: [
        'top',
        'bottom',
        'left',
        'right',
      ],
    },
    variant: {
      control: 'select',
      description: 'Visual style variant of the link',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'destructive-primary',
        'destructive-tertiary',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: LinkPlayground,
} satisfies Meta<typeof LinkPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Learn More',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const link = canvas.getByRole('link')

    await expect(link).toHaveTextContent('Learn More')

    await expect(link).toHaveAttribute('href', '#')
  },
  render: (args) => ({
    components: {
      LinkPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<LinkPlayground v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  args: {
    label: 'Link',
  },
  render: (args) => ({
    components: {
      LinkVariantsPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<LinkVariantsPlayground v-bind="args" />',
  }),
}

export const AllSizes: Story = {
  args: {
    label: 'Link',
  },
  render: (args) => ({
    components: {
      LinkSizesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<LinkSizesPlayground v-bind="args" />',
  }),
}

export const Icons: Story = {
  args: {
    label: 'Link',
  },
  render: (args) => ({
    components: {
      LinkIconsPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<LinkIconsPlayground v-bind="args" />',
  }),
}

export const States: Story = {
  args: {
    label: 'Link',
  },
  render: (args) => ({
    components: {
      LinkStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<LinkStatesPlayground v-bind="args" />',
  }),
}
