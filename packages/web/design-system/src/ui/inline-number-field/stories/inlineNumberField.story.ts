import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import InlineNumberFieldPlayground from './InlineNumberFieldPlayground.vue'
import InlineNumberFieldStatesPlayground from './InlineNumberFieldStatesPlayground.vue'

const meta = {
  title: 'Components/Inline Fields/InlineNumberField',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the field is loading',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the field is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    errorMessage: {
      control: 'text',
      description: 'The error message (shown as inline icon)',
    },
    label: {
      control: 'text',
      description: 'Accessible label (sr-only)',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    size: {
      control: 'select',
      description: 'Size of the field',
      options: [
        'xs',
        'sm',
        'md',
      ],
    },
    step: {
      control: 'number',
      description: 'Step for arrow keys',
    },
    variant: {
      control: 'select',
      description: 'Visual variant to match the surface',
      options: [
        'primary',
        'secondary',
        'tertiary',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: InlineNumberFieldPlayground,
} satisfies Meta<typeof InlineNumberFieldPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Quantity',
    placeholder: '0',
  },
}

export const AllStates: Story = {
  render: (args) => ({
    components: {
      InlineNumberFieldStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<InlineNumberFieldStatesPlayground v-bind="args" />',
  }),
}
