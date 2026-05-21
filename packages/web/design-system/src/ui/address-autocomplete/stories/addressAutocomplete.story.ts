import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import AddressAutocompletePlayground from './AddressAutocompletePlayground.vue'

const meta = {
  title: 'Components/AddressAutocomplete',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
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
      description: 'The hint text',
    },
    label: {
      control: 'text',
      description: 'The label',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text',
    },
    size: {
      control: 'select',
      description: 'The size of the input',
      options: [
        'sm',
        'md',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: AddressAutocompletePlayground,
} satisfies Meta<typeof AddressAutocompletePlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Address',
    placeholder: 'Search an address...',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    label: 'Address',
    placeholder: 'Search an address...',
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Please enter a valid address',
    label: 'Address',
    placeholder: 'Search an address...',
  },
}

export const SmallSize: Story = {
  args: {
    label: 'Address',
    placeholder: 'Search an address...',
    size: 'sm',
  },
}
