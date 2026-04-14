import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import TextFieldFormPlayground from './TextFieldFormPlayground.vue'
import TextFieldPlayground from './TextFieldPlayground.vue'
import TextFieldSizesPlayground from './TextFieldSizesPlayground.vue'
import TextFieldStatesPlayground from './TextFieldStatesPlayground.vue'

const meta = {
  title: 'Components/TextField',
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
    placeholder: {
      control: 'text',
      description: 'The placeholder text of the input',
    },
    size: {
      control: 'select',
      description: 'The size of the text field',
      options: [
        'sm',
        'md',
      ],
    },
    type: {
      control: 'select',
      description: 'The type of the input',
      options: [
        'text',
        'email',
        'password',
        'search',
        'tel',
        'time',
        'url',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: TextFieldPlayground,
} satisfies Meta<typeof TextFieldPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Enter text...',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByLabelText('Label')

    await userEvent.type(input, 'Hello World')

    await expect(input).toHaveValue('Hello World')
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

    await expect(canvas.getByText('This field has an error')).toBeVisible()
  },
  render: (args) => ({
    components: {
      TextFieldStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TextFieldStatesPlayground v-bind="args" />',
  }),
}

export const AllSizes: Story = {
  render: (args) => ({
    components: {
      TextFieldSizesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TextFieldSizesPlayground v-bind="args" />',
  }),
}

export const FormExample: Story = {
  render: (args) => ({
    components: {
      TextFieldFormPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TextFieldFormPlayground v-bind="args" />',
  }),
}
