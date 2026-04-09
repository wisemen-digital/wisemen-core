import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import { Temporal } from 'temporal-polyfill'

import DateRangePickerPlayground from './DateRangePickerPlayground.vue'

const meta = {
  title: 'Components/DateRangePicker',
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
      description: 'Whether the date range picker is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the date range picker is in a loading state',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the date range picker is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the date range picker is required',
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
      description: 'The label of the date range picker',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text shown when no date range is selected',
    },
    size: {
      control: 'select',
      description: 'The size of the date range picker trigger',
      options: [
        'sm',
        'md',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: DateRangePickerPlayground,
} satisfies Meta<typeof DateRangePickerPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Date range',
    placeholder: 'Select a date range',
  },
}

export const WithHint: Story = {
  args: {
    hint: 'Please select a date range.',
    label: 'Date range',
    placeholder: 'Select a date range',
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Please select a valid date range.',
    label: 'Date range',
    placeholder: 'Select a date range',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    label: 'Date range',
    placeholder: 'Select a date range...',
  },
}

export const WithDateConstraints: Story = {
  args: {
    minDate: Temporal.PlainDate.from({
      day: 1,
      month: 4,
      year: 2026,
    }),
    label: 'Date range',
    placeholder: 'Select a date range...',
  },
}

export const SmallSize: Story = {
  args: {
    label: 'Date range',
    placeholder: 'Select a date range...',
    size: 'sm',
  },
}
