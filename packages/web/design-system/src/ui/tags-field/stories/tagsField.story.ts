import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import TagsFieldPlayground from './TagsFieldPlayground.vue'
import TagsFieldSizesPlayground from './TagsFieldSizesPlayground.vue'
import TagsFieldStatesPlayground from './TagsFieldStatesPlayground.vue'

const meta = {
  title: 'Components/TagsField',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the input is in a loading state',
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
      description: 'The error message to display',
    },
    hideErrorMessage: {
      control: 'boolean',
      description: 'Whether to hide the error message visually',
    },
    hint: {
      control: 'text',
      description: 'The hint text of the input',
    },
    label: {
      control: 'text',
      description: 'The label of the input',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text shown when there are no tags',
    },
    size: {
      control: 'select',
      description: 'The size of the tags field',
      options: [
        'sm',
        'md',
      ],
    },
    max: {
      control: 'number',
      description: 'The maximum number of tags allowed (null = unlimited)',
    },
    allowDuplicate: {
      control: 'boolean',
      description: 'Whether duplicate tags are allowed',
    },
    addOnPaste: {
      control: 'boolean',
      description: 'Whether to add tags when pasting',
    },
    delimiter: {
      control: 'text',
      description: 'The delimiter used to split pasted text into tags',
    },
  },
  tags: [
    'autodocs',
  ],
  component: TagsFieldPlayground,
} satisfies Meta<typeof TagsFieldPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Tags',
    placeholder: 'Add a tag...',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox')

    await userEvent.type(input, 'Vue')
    await userEvent.keyboard('{Enter}')

    await expect(canvas.getByText('Vue')).toBeVisible()

    await userEvent.type(input, 'TypeScript')
    await userEvent.keyboard('{Enter}')

    await expect(canvas.getByText('TypeScript')).toBeVisible()
  },
}

export const AllStates: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const disabledInput = canvas.getAllByRole('textbox').find(
      (el) => el.closest('[data-disabled]') !== null,
    )

    await expect(disabledInput).toBeDisabled()

    await expect(canvas.getByText('This field has an error')).toBeVisible()
  },
  render: (args) => ({
    components: {
      TagsFieldStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TagsFieldStatesPlayground v-bind="args" />',
  }),
}

export const AllSizes: Story = {
  render: (args) => ({
    components: {
      TagsFieldSizesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TagsFieldSizesPlayground v-bind="args" />',
  }),
}
