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
  },
  tags: [
    'autodocs',
  ],
  component: DatePickerPlayground,
} satisfies Meta<typeof DatePickerPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithDateConstraints: Story = {
  args: {
    minDate: Temporal.PlainDate.from({
      day: 1,
      month: 4,
      year: 2026,
    }),
  },
}
