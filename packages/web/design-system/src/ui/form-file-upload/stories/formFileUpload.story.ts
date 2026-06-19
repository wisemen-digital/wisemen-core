import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  within,
} from 'storybook/test'

import FormFileUploadPlayground from './FormFileUploadPlayground.vue'
import FormFileUploadStatesPlayground from './FormFileUploadStatesPlayground.vue'

const meta = {
  title: 'Components/FormFileUpload',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Disables upload interactions and the trigger button',
    },
    isRequired: {
      control: 'boolean',
      description: 'Marks the field as required in the label and accessibility attributes',
    },
    accept: {
      control: 'object',
      description: 'Accepted MIME types passed to the upload field',
    },
    description: {
      control: 'text',
      description: 'Supporting text shown below the empty-state title',
    },
    errorMessage: {
      control: 'text',
      description: 'Validation error displayed below the field',
    },
    hideErrorMessage: {
      description: 'Whether the error message should stay accessible but hidden visually',
      table: {
        disable: true,
      },
    },
    hint: {
      control: 'text',
      description: 'Hint text shown below the label',
    },
    label: {
      control: 'text',
      description: 'Field label displayed above the upload area',
    },
    mode: {
      control: 'select',
      description: 'Chooses between single-file and multi-file model shapes in the playground',
      options: [
        'single',
        'multiple',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: FormFileUploadPlayground,
} satisfies Meta<typeof FormFileUploadPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    description: 'Images, PDFs, and text files are supported.',
    hint: 'Drop files anywhere on the field or paste an image from your clipboard.',
    label: 'Files',
    mode: 'single',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', {
      name: 'Upload',
    })).toBeVisible()
    await expect(canvas.getByText('Images, PDFs, and text files are supported.')).toBeVisible()
  },
}

export const AllStates: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', {
      name: 'Upload',
    })).toBeVisible()
    await expect(canvas.getByText('Please upload at least one file.')).toBeVisible()
    await expect(canvas.getByRole('button', {
      name: 'Add files',
    })).toBeVisible()

    const disabledButtons = canvas.getAllByRole('button').filter(
      (button) => (button as HTMLButtonElement).disabled,
    )

    await expect(disabledButtons.length).toBeGreaterThan(0)
  },
  render: (args) => ({
    components: {
      FormFileUploadStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<FormFileUploadStatesPlayground v-bind="args" />',
  }),
}
