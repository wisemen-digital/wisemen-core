import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  within,
} from 'storybook/test'

import PhoneNumberFieldFormPlayground from './PhoneNumberFieldFormPlayground.vue'
import PhoneNumberFieldPlayground from './PhoneNumberFieldPlayground.vue'
import PhoneNumberFieldStatesPlayground from './PhoneNumberFieldStatesPlayground.vue'

const meta = {
  title: 'Components/PhoneNumberField',
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
    defaultCountryCode: {
      control: 'text',
      description: 'Default country code when no value is set',
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
      description: 'The hint text',
    },
    label: {
      control: 'text',
      description: 'The label of the input',
    },
    size: {
      control: 'select',
      description: 'The size of the field',
      options: [
        'sm',
        'md',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: PhoneNumberFieldPlayground,
} satisfies Meta<typeof PhoneNumberFieldPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Phone number',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByLabelText('Phone number')

    await expect(input).toBeInTheDocument()
  },
}

export const WithPreferredCountries: Story = {
  args: {
    label: 'Phone number',
    preferredCountryCodes: [
      'BE',
      'NL',
      'FR',
      'DE',
    ],
  },
}

export const AllStates: Story = {
  render: (args) => ({
    components: {
      PhoneNumberFieldStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<PhoneNumberFieldStatesPlayground v-bind="args" />',
  }),
}

export const FormExample: Story = {
  render: (args) => ({
    components: {
      PhoneNumberFieldFormPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<PhoneNumberFieldFormPlayground v-bind="args" />',
  }),
}
