import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import TimeFieldHourCyclePlayground from './TimeFieldHourCyclePlayground.vue'
import TimeFieldPlayground from './TimeFieldPlayground.vue'
import TimeFieldStatesPlayground from './TimeFieldStatesPlayground.vue'

const meta = {
  title: 'Components/TimeField',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the time field is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the time field is in a loading state',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the time field is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the time field is required',
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
      description: 'The label of the time field',
    },
    size: {
      control: 'select',
      description: 'The size of the time field',
      options: [
        'sm',
        'md',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: TimeFieldPlayground,
} satisfies Meta<typeof TimeFieldPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Time',
  },
}

export const WithHint: Story = {
  args: {
    hint: 'Enter the time in the correct format.',
    label: 'Time',
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Please enter a valid time.',
    label: 'Time',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    label: 'Time',
  },
}

export const SmallSize: Story = {
  args: {
    label: 'Time',
    size: 'sm',
  },
}

export const AllStates: Story = {
  render: (args) => ({
    components: {
      TimeFieldStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TimeFieldStatesPlayground v-bind="args" />',
  }),
}

export const HourCycle: Story = {
  render: (args) => ({
    components: {
      TimeFieldHourCyclePlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TimeFieldHourCyclePlayground v-bind="args" />',
  }),
}
