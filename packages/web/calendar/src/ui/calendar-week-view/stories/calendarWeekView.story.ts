import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import CalendarWeekViewPlayground from './CalendarWeekViewPlayground.vue'

const meta = {
  title: 'Calendar/WeekView',
  argTypes: {
    endHour: {
      control: {
        max: 24,
        min: 1,
        type: 'number',
      },
      description: 'Last hour rendered in the grid (exclusive)',
    },
    firstDayOfWeek: {
      control: 'select',
      description: 'First day of the visible week (0 = Sunday, 1 = Monday)',
      options: [
        0,
        1,
      ],
    },
    startHour: {
      control: {
        max: 23,
        min: 0,
        type: 'number',
      },
      description: 'First hour rendered in the grid',
    },
  },
  tags: [
    'autodocs',
  ],
  component: CalendarWeekViewPlayground,
} satisfies Meta<typeof CalendarWeekViewPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    endHour: 24,
    firstDayOfWeek: 1,
    startHour: 0,
  },
}

export const BusinessHours: Story = {
  args: {
    endHour: 19,
    firstDayOfWeek: 1,
    startHour: 7,
  },
}

export const SundayFirst: Story = {
  args: {
    endHour: 24,
    firstDayOfWeek: 0,
    startHour: 0,
  },
}
