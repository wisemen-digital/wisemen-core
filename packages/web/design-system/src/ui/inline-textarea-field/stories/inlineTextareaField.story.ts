import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import InlineTextareaFieldPlayground from './InlineTextareaFieldPlayground.vue'
import InlineTextareaFieldStatesPlayground from './InlineTextareaFieldStatesPlayground.vue'

const meta = {
  title: 'Components/Inline Fields/InlineTextareaField',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the textarea is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the textarea is required',
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
    resize: {
      control: 'select',
      description: 'Resize behaviour',
      options: [
        'none',
        'vertical',
        'auto-vertical',
      ],
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
  component: InlineTextareaFieldPlayground,
} satisfies Meta<typeof InlineTextareaFieldPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Enter text...',
  },
}

export const AllStates: Story = {
  render: (args) => ({
    components: {
      InlineTextareaFieldStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<InlineTextareaFieldStatesPlayground v-bind="args" />',
  }),
}
