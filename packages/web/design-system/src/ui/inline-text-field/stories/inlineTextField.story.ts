import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import InlineTextFieldPlayground from './InlineTextFieldPlayground.vue'
import InlineTextFieldStatesPlayground from './InlineTextFieldStatesPlayground.vue'

const meta = {
  title: 'Components/Inline Fields/InlineTextField',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the input is loading',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    errorMessage: {
      control: 'text',
      description: 'The error message (shown as inline icon)',
    },
    label: {
      control: 'text',
      description: 'Accessible label (sr-only)',
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
    type: {
      control: 'select',
      description: 'Input type',
      options: [
        'text',
        'email',
        'password',
        'search',
        'tel',
        'time',
        'url',
      ],
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
  component: InlineTextFieldPlayground,
} satisfies Meta<typeof InlineTextFieldPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'First name',
    placeholder: 'Enter text...',
  },
}

export const AllStates: Story = {
  render: (args) => ({
    components: {
      InlineTextFieldStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<InlineTextFieldStatesPlayground v-bind="args" />',
  }),
}
