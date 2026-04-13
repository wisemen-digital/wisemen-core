import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import IconButtonPlayground from './IconButtonPlayground.vue'
import IconButtonSizesPlayground from './IconButtonSizesPlayground.vue'
import IconButtonStatesPlayground from './IconButtonStatesPlayground.vue'
import IconButtonVariantsPlayground from './IconButtonVariantsPlayground.vue'

const meta = {
  title: 'Components/IconButton',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Disables the button, preventing user interaction',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows a loading state and disables interaction',
    },
    isTooltipDisabled: {
      control: 'boolean',
      description: 'Disables tooltip display',
    },
    keyboardShortcut: {
      control: 'text',
      description: 'Visual representation of a keyboard shortcut (e.g. "⌘K")',
    },
    label: {
      control: 'text',
      description: 'Accessible label for the button (required for screen readers)',
    },
    size: {
      control: 'select',
      description: 'Controls the button size',
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
    type: {
      control: 'select',
      description: 'Native button type attribute',
      options: [
        'button',
        'submit',
        'reset',
      ],
    },
    variant: {
      control: 'select',
      description: 'Visual style variant of the button',
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
  component: IconButtonPlayground,
} satisfies Meta<typeof IconButtonPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Settings',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const button = canvas.getByRole('button', {
      name: 'Settings',
    })

    await expect(button).not.toBeDisabled()

    const icon = button.querySelector('svg')

    await expect(icon).toBeInTheDocument()

    await userEvent.click(button)
  },
}

export const AllVariants: Story = {
  args: {
    label: 'Settings',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const buttons = canvas.getAllByRole('button')

    await expect(buttons).toHaveLength(5)

    for (const button of buttons) {
      const icon = button.querySelector('svg')

      await expect(icon).toBeInTheDocument()
    }
  },
  render: (args) => ({
    components: {
      IconButtonVariantsPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<IconButtonVariantsPlayground v-bind="args" />',
  }),
}

export const AllSizes: Story = {
  args: {
    label: 'Settings',
  },
  render: (args) => ({
    components: {
      IconButtonSizesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<IconButtonSizesPlayground v-bind="args" />',
  }),
}

export const States: Story = {
  args: {
    label: 'Settings',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const buttons = canvas.getAllByRole('button')

    const loadingButtons = buttons.filter(
      (button) => button.getAttribute('aria-busy') === 'true',
    )

    for (const button of loadingButtons) {
      await expect(button).toHaveAttribute('aria-disabled', 'true')
    }

    const disabledButtons = buttons.filter(
      (button) => (
        button as HTMLButtonElement
      ).disabled,
    )

    for (const button of disabledButtons) {
      await expect(button).toBeDisabled()
    }
  },
  render: (args) => ({
    components: {
      IconButtonStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<IconButtonStatesPlayground v-bind="args" />',
  }),
}
