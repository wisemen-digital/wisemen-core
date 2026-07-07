import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import { Temporal } from 'temporal-polyfill'

import DateFieldPlayground from './DateFieldPlayground.vue'

const meta = {
  title: 'Components/DateField',
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
      description: 'Whether the date field is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the date field is in a loading state',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the date field is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the date field is required',
    },
    errorMessage: {
      control: 'text',
      description: 'The error message to display',
    },
    hideErrorMessage: {
      control: 'boolean',
      description: 'Whether to hide the error message visually',
      table: {
        disable: true,
      },
    },
    hint: {
      control: 'text',
      description: 'The hint text below the field',
    },
    label: {
      control: 'text',
      description: 'The label of the date field',
    },
    size: {
      control: 'select',
      description: 'The size of the date field',
      options: [
        'sm',
        'md',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: DateFieldPlayground,
} satisfies Meta<typeof DateFieldPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Date',
  },
}

export const WithHint: Story = {
  args: {
    hint: 'Please select a date within the allowed range.',
    label: 'Date',
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Please select a valid date.',
    label: 'Date',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    label: 'Date',
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
  },
}

export const SmallSize: Story = {
  args: {
    label: 'Date',
    size: 'sm',
  },
}

export const WithDayIndicators: Story = {
  args: {
    getDayConfig: (date) => {
      const today = Temporal.Now.plainDateISO()
      const yesterday = today.subtract({
        days: 1,
      })
      const tomorrow = today.add({
        days: 1,
      })

      if (date.equals(yesterday) || date.equals(tomorrow)) {
        return {
          color: 'error',
          type: 'dot',
        }
      }

      return null
    },
    label: 'Date',
  },
}
