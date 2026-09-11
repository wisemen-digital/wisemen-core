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
    snapDuration: {
      control: {
        max: 60,
        min: 5,
        step: 5,
        type: 'number',
      },
      description: 'Snap granularity in minutes, shared by move, resize and slot selection',
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

const BASE_ARGS = {
  endHour: 24,
  firstDayOfWeek: 1,
  snapDuration: 15,
  startHour: 0,
} as const

export const Default: Story = {
  args: {
    ...BASE_ARGS,
  },
}

export const BusinessHours: Story = {
  args: {
    ...BASE_ARGS,
    endHour: 19,
    startHour: 7,
  },
}

export const SundayFirst: Story = {
  args: {
    ...BASE_ARGS,
    firstDayOfWeek: 0,
  },
}

/**
 * Every gesture enabled. Drag an event to move it, grab the top or bottom
 * edge to resize, drag empty space to select a slot, and hold Alt while
 * dragging to duplicate. "Locked: payroll cutoff" is `readOnly` and refuses
 * both; "Fixed length: certification exam" moves but will not resize.
 * "Overnight deploy" crosses midnight and renders as two linked segments.
 */
export const Editable: Story = {
  args: {
    ...BASE_ARGS,
    isCreatable: true,
    isDraggable: true,
    isResizable: true,
    endHour: 24,
    startHour: 6,
  },
}

/**
 * The same calendar with a live `canDropEvent` gate rejecting any drop that
 * would land after noon. The drag is blocked while it is still in flight —
 * the carry and the placeholder both turn red via `data-drop-invalid`, and
 * releasing there commits nothing.
 */
export const RejectedDrops: Story = {
  args: {
    ...BASE_ARGS,
    isDraggable: true,
    isResizable: true,
    rejectAfternoons: true,
    startHour: 6,
  },
}

/** Coarse snapping, to make the absolute-grid snap behaviour obvious. */
export const HalfHourSnapping: Story = {
  args: {
    ...BASE_ARGS,
    isCreatable: true,
    isDraggable: true,
    isResizable: true,
    snapDuration: 30,
    startHour: 6,
  },
}
