import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'
import { ref } from 'vue'

import SegmentedControlAvailabilityPlayground from './SegmentedControlAvailabilityPlayground.vue'
import SegmentedControlGroupPlayground from './SegmentedControlGroupPlayground.vue'
import SegmentedControlPlayground from './SegmentedControlPlayground.vue'

const meta = {
  title: 'Components/SegmentedControl',
  argTypes: {
    hasDescriptions: {
      control: 'boolean',
      description: 'Shows a secondary description line underneath each segment\'s label. Segments grow taller to fit both lines instead of matching the height of other form controls.',
    },
    isDescriptionCentered: {
      control: 'boolean',
      description: 'Centers each segment\'s label and description instead of left-aligning them. Only affects segments that have a description.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables every segment in the control',
    },
    disabledReason: {
      control: 'text',
      description: 'Tooltip text shown when the segmented control is disabled',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed underneath the control, replacing the hint',
    },
    hint: {
      control: 'text',
      description: 'Hint text displayed underneath the control',
    },
    label: {
      control: 'text',
      description: 'Field label displayed above the control',
    },
    modelValue: {
      table: {
        disable: true,
      },
    },
    size: {
      control: 'select',
      description: 'Controls the height of the segments. Matches the height of other form controls (e.g. TextField, Select) when no segment has a description.',
      options: [
        'md',
        'sm',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: SegmentedControlPlayground,
} satisfies Meta<typeof SegmentedControlPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    hasDescriptions: false,
    isDescriptionCentered: false,
    isDisabled: false,
    disabledReason: null,
    errorMessage: null,
    hint: null,
    label: 'Notifications',
    modelValue: 'email',
    size: 'md',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const options = canvas.getAllByRole('radio')

    await expect(options).toHaveLength(4)
    await expect(options[1]).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(options[3]!)

    await expect(options[3]).toHaveAttribute('aria-checked', 'true')
    await expect(options[1]).toHaveAttribute('aria-checked', 'false')
  },
  render: (args) => ({
    components: {
      SegmentedControlPlayground,
    },
    setup() {
      const modelValue = ref<string>('email')

      return {
        args,
        modelValue,
      }
    },
    template: `
      <SegmentedControlPlayground
        v-bind="args"
        v-model="modelValue"
      />
    `,
  }),
}

export const WithDescriptions: Story = {
  args: {
    hasDescriptions: true,
    isDescriptionCentered: false,
    isDisabled: false,
    disabledReason: null,
    errorMessage: null,
    hint: null,
    label: 'Notifications',
    modelValue: 'email',
    size: 'md',
  },
  render: (args) => ({
    components: {
      SegmentedControlPlayground,
    },
    setup() {
      const modelValue = ref<string>('email')

      return {
        args,
        modelValue,
      }
    },
    template: `
      <SegmentedControlPlayground
        v-bind="args"
        v-model="modelValue"
      />
    `,
  }),
}

export const Disabled: Story = {
  args: {
    hasDescriptions: false,
    isDescriptionCentered: false,
    isDisabled: true,
    disabledReason: 'You don\'t have permission to change this setting',
    errorMessage: null,
    hint: null,
    label: 'Notifications',
    modelValue: 'email',
    size: 'md',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const options = canvas.getAllByRole('radio')

    for (const option of options) {
      await expect(option).toBeDisabled()
    }
  },
  render: (args) => ({
    components: {
      SegmentedControlPlayground,
    },
    setup() {
      const modelValue = ref<string>('email')

      return {
        args,
        modelValue,
      }
    },
    template: `
      <SegmentedControlPlayground
        v-bind="args"
        v-model="modelValue"
      />
    `,
  }),
}

export const WithFieldProps: Story = {
  args: {
    hasDescriptions: false,
    isDescriptionCentered: false,
    isDisabled: false,
    disabledReason: null,
    errorMessage: 'Select at least one notification channel',
    hint: 'Choose how you want to be notified',
    label: 'Notifications',
    modelValue: 'email',
    size: 'md',
  },
  render: (args) => ({
    components: {
      SegmentedControlPlayground,
    },
    setup() {
      const modelValue = ref<string>('email')

      return {
        args,
        modelValue,
      }
    },
    template: `
      <SegmentedControlPlayground
        v-bind="args"
        v-model="modelValue"
      />
    `,
  }),
}

export const MultiSelect: Story = {
  args: {
    isDisabled: false,
    disabledReason: null,
    errorMessage: null,
    hint: null,
    label: 'Available days',
    modelValue: 'monday',
    size: 'md',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const options = canvas.getAllByRole('checkbox')

    await expect(options).toHaveLength(7)
    await expect(options[0]).toHaveAttribute('aria-checked', 'true')
    await expect(options[3]).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(options[3]!)

    await expect(options[3]).toHaveAttribute('aria-checked', 'true')
    await expect(options[0]).toHaveAttribute('aria-checked', 'true')
  },
  render: (args) => ({
    components: {
      SegmentedControlGroupPlayground,
    },
    setup() {
      const modelValue = ref<string[]>([
        'monday',
        'tuesday',
        'wednesday',
      ])

      return {
        args,
        modelValue,
      }
    },
    template: `
      <SegmentedControlGroupPlayground
        :is-disabled="args.isDisabled"
        :disabled-reason="args.disabledReason"
        :error-message="args.errorMessage"
        :hint="args.hint"
        :label="args.label"
        :size="args.size"
        v-model="modelValue"
      />
    `,
  }),
}

export const AvailabilityPicker: Story = {
  args: {
    isDescriptionCentered: true,
    isDisabled: false,
    disabledReason: null,
    errorMessage: null,
    hint: null,
    label: 'Beschikbaarheden',
    modelValue: 'monday',
    size: 'md',
  },
  render: (args) => ({
    components: {
      SegmentedControlAvailabilityPlayground,
    },
    setup() {
      const modelValue = ref<string[]>([
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
      ])

      return {
        args,
        modelValue,
      }
    },
    template: `
      <SegmentedControlAvailabilityPlayground
        :is-description-centered="args.isDescriptionCentered"
        :is-disabled="args.isDisabled"
        :disabled-reason="args.disabledReason"
        :error-message="args.errorMessage"
        :hint="args.hint"
        :label="args.label"
        :size="args.size"
        v-model="modelValue"
      />
    `,
  }),
}
