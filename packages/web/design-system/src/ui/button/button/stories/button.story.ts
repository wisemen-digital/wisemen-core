import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import ButtonIconsPlayground from './ButtonIconsPlayground.vue'
import ButtonPlayground from './ButtonPlayground.vue'
import ButtonSizesPlayground from './ButtonSizesPlayground.vue'
import ButtonStatesPlayground from './ButtonStatesPlayground.vue'
import ButtonVariantsPlayground from './ButtonVariantsPlayground.vue'

const meta = {
  title: 'Components/Button',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Disables the button, preventing user interaction',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows a loading state and disables interaction',
    },
    disabledReason: {
      control: 'text',
      description: 'Provides a reason why the button is disabled, shown in tooltip',
    },
    keyboardShortcut: {
      control: 'text',
      description: 'Visual representation of a keyboard shortcut (e.g. "⌘K")',
    },
    label: {
      control: 'text',
      description: 'Text label displayed inside the button',
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
    tooltipSide: {
      control: 'select',
      description: 'Position of the tooltip relative to the button',
      options: [
        'top',
        'bottom',
        'left',
        'right',
      ],
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
  component: ButtonPlayground,
} satisfies Meta<typeof ButtonPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Button',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const button = canvas.getByRole('button')

    await expect(button).toHaveTextContent('Button')

    await expect(button).not.toBeDisabled()

    await userEvent.click(button)
  },
}

export const AllVariants: Story = {
  args: {
    label: 'Button',
  },
  render: (args) => ({
    components: {
      ButtonVariantsPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<ButtonVariantsPlayground v-bind="args" />',
  }),
}

export const AllSizes: Story = {
  args: {
    label: 'Button',
  },
  render: (args) => ({
    components: {
      ButtonSizesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<ButtonSizesPlayground v-bind="args" />',
  }),
}

export const States: Story = {
  args: {
    label: 'Button',
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
      (button) => (button as HTMLButtonElement).disabled,
    )

    for (const button of disabledButtons) {
      await expect(button).toBeDisabled()
    }
  },
  render: (args) => ({
    components: {
      ButtonStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<ButtonStatesPlayground v-bind="args" />',
  }),
}

export const Icons: Story = {
  args: {
    label: 'Button',
  },
  render: (args) => ({
    components: {
      ButtonIconsPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<ButtonIconsPlayground v-bind="args" />',
  }),
}
