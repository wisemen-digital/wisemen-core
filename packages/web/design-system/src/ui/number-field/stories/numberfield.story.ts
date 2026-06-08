import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import NumberFieldFormPlayground from './NumberFieldFormPlayground.vue'
import NumberFieldPlayground from './NumberFieldPlayground.vue'
import NumberFieldStatesPlayground from './NumberFieldStatesPlayground.vue'

const meta = {
  title: 'Components/NumberField',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the input is in a loading state',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    errorMessage: {
      control: 'text',
      description: 'The error message to display',
    },
    hideErrorMessage: {
      control: 'boolean',
      description: 'Whether to hide the error message visually',
    },
    hint: {
      control: 'text',
      description: 'The hint text of the input',
    },
    label: {
      control: 'text',
      description: 'The label of the input',
    },
    max: {
      control: 'number',
      description: 'The maximum value of the number input',
    },
    min: {
      control: 'number',
      description: 'The minimum value of the number input',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text of the input',
    },
    showControls: {
      control: 'boolean',
      description: 'Whether to display increment and decrement controls',
    },
    step: {
      control: 'number',
      description: 'The increment and decrement step for the number input',
    },
  },
  tags: [
    'autodocs',
  ],
  component: NumberFieldPlayground,
} satisfies Meta<typeof NumberFieldPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Number Field',
    placeholder: 'Enter a number',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByLabelText('Number Field')

    await userEvent.type(input, '42')

    await expect(input).toHaveValue('42')
  },
}

export const WithControls: Story = {
  args: {
    label: 'Number Field',
    showControls: true,
    step: 1,
  },
}

export const AllStates: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const disabledInput = canvas.getByLabelText('Disabled')

    await expect(disabledInput).toBeDisabled()

    const readonlyInput = canvas.getByLabelText('Read Only')

    await expect(readonlyInput).toHaveAttribute('readonly')

    const errorInput = canvas.getByLabelText('Error')

    await expect(errorInput).toHaveAttribute('aria-invalid', 'true')
  },
  render: (args) => ({
    components: {
      NumberFieldStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<NumberFieldStatesPlayground v-bind="args" />',
  }),
}

export const FormExample: Story = {
  render: (args) => ({
    components: {
      NumberFieldFormPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<NumberFieldFormPlayground v-bind="args" />',
  }),
}
