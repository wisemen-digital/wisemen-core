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
    showPresets: {
      control: 'boolean',
      description: 'Whether to show the presets sidebar',
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
    showPresets: true,
  },
}

export const WithoutPresets: Story = {
  args: {
    showPresets: false,
  },
}

export const WithDateConstraints: Story = {
  args: {
    minDate: Temporal.PlainDate.from({
      day: 1,
      month: 4,
      year: 2026,
    }),
    showPresets: true,
  },
}
