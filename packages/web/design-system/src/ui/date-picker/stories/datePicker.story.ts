import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import { Temporal } from 'temporal-polyfill'

import DatePickerPlayground from './DatePickerPlayground.vue'

const meta = {
  title: 'Components/DatePicker',
  argTypes: {
    maxDate: {
      control: 'text',
      description: 'The maximum selectable date in ISO format (YYYY-MM-DD)',
    },
    minDate: {
      control: 'text',
      description: 'The minimum selectable date in ISO format (YYYY-MM-DD)',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the date picker is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the date picker is in a loading state',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the date picker is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the date picker is required',
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
      description: 'The hint text below the field',
    },
    label: {
      control: 'text',
      description: 'The label of the date picker',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text shown when no date is selected',
    },
    size: {
      control: 'select',
      description: 'The size of the date picker trigger',
      options: [
        'sm',
        'md',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: DatePickerPlayground,
} satisfies Meta<typeof DatePickerPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Date',
    placeholder: 'Select a date',
  },
}

export const WithHint: Story = {
  args: {
    hint: 'Please select a date within the allowed range.',
    label: 'Date',
    placeholder: 'Select a date',
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Please select a valid date.',
    label: 'Date',
    placeholder: 'Select a date',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    label: 'Date',
    placeholder: 'Select a date...',
  },
}

export const WithDateConstraints: Story = {
  args: {
    minDate: Temporal.PlainDate.from({
      day: 1,
      month: 4,
      year: 2026,
    }),
    label: 'Date',
    placeholder: 'Select a date...',
  },
}

export const SmallSize: Story = {
  args: {
    label: 'Date',
    placeholder: 'Select a date...',
    size: 'sm',
  },
}
