import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import TextareaFieldFormPlayground from './TextareaFieldFormPlayground.vue'
import TextareaFieldMaxLengthPlayground from './TextareaFieldMaxLengthPlayground.vue'
import TextareaFieldPlayground from './TextareaFieldPlayground.vue'
import TextareaFieldResizePlayground from './TextareaFieldResizePlayground.vue'
import TextareaFieldStatesPlayground from './TextareaFieldStatesPlayground.vue'

const meta = {
  title: 'Components/TextareaField',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the textarea is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the textarea is required',
    },
    isSpellCheckEnabled: {
      control: 'boolean',
      description: 'Whether spell check is enabled',
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
      description: 'The hint text of the textarea',
    },
    label: {
      control: 'text',
      description: 'The label of the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text of the textarea',
    },
    resize: {
      control: 'select',
      description: 'The resize behavior of the textarea',
      options: [
        'none',
        'vertical',
        'auto-vertical',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: TextareaFieldPlayground,
} satisfies Meta<typeof TextareaFieldPlayground>

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

    const textarea = canvas.getByLabelText('Label')

    await userEvent.type(textarea, 'Hello World')

    await expect(textarea).toHaveValue('Hello World')
  },
}

export const AllStates: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const disabledTextarea = canvas.getByLabelText('Disabled')

    await expect(disabledTextarea).toBeDisabled()

    const readonlyTextarea = canvas.getByLabelText('Read Only')

    await expect(readonlyTextarea).toHaveAttribute('readonly')

    const errorTextarea = canvas.getByLabelText('Error')

    await expect(errorTextarea).toHaveAttribute('aria-invalid', 'true')

    await expect(canvas.getByText('This field has an error')).toBeVisible()
  },
  render: (args) => ({
    components: {
      TextareaFieldStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TextareaFieldStatesPlayground v-bind="args" />',
  }),
}

export const AllResizeModes: Story = {
  render: (args) => ({
    components: {
      TextareaFieldResizePlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TextareaFieldResizePlayground v-bind="args" />',
  }),
}

export const MaxLength: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const textarea = canvas.getByLabelText('With max length')

    await expect(canvas.getByText('0/500')).toBeVisible()

    await userEvent.type(textarea, 'Hello')

    await expect(canvas.getByText('5/500')).toBeVisible()
  },
  render: (args) => ({
    components: {
      TextareaFieldMaxLengthPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TextareaFieldMaxLengthPlayground v-bind="args" />',
  }),
}

export const FormExample: Story = {
  render: (args) => ({
    components: {
      TextareaFieldFormPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TextareaFieldFormPlayground v-bind="args" />',
  }),
}
