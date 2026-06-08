import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import SelectConfigPlayground from './SelectConfigPlayground.vue'
import SelectMultiConfigPlayground from './SelectMultiConfigPlayground.vue'
import SelectMultiPlayground from './SelectMultiPlayground.vue'
import SelectPlayground from './SelectPlayground.vue'

const meta = {
  title: 'Components/Select',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the select is in a loading state',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the select is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the select is required',
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
      description: 'The hint text of the select',
    },
    label: {
      control: 'text',
      description: 'The label of the select',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text of the select',
    },
    search: {
      control: 'select',
      description: 'The search mode of the select',
      options: [
        null,
        'local',
        'remote',
      ],
    },
    size: {
      control: 'select',
      description: 'The size of the select',
      options: [
        'sm',
        'md',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: SelectPlayground,
} satisfies Meta<typeof SelectPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Fruit',
    placeholder: 'Select a fruit...',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const trigger = canvas.getByRole('combobox')

    await expect(trigger).toBeInTheDocument()
    await expect(trigger).not.toBeDisabled()

    await userEvent.click(trigger)

    const listbox = within(document.body).getByRole('listbox')

    await expect(listbox).toBeVisible()

    const options = within(listbox).getAllByRole('option')

    await expect(options.length).toBeGreaterThan(0)

    await userEvent.click(options[0]!)

    await expect(trigger).toHaveTextContent('Apple')
  },
}

export const WithSearch: Story = {
  args: {
    label: 'Fruit',
    placeholder: 'Select a fruit...',
    search: 'local',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    label: 'Fruit',
    placeholder: 'Select a fruit...',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const trigger = canvas.getByRole('combobox')

    await expect(trigger).toBeDisabled()
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Please select a fruit',
    label: 'Fruit',
    placeholder: 'Select a fruit...',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Please select a fruit')).toBeVisible()
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    label: 'Fruit',
    placeholder: 'Select a fruit...',
  },
}

export const SmallSize: Story = {
  args: {
    label: 'Fruit',
    placeholder: 'Select a fruit...',
    size: 'sm',
  },
}

export const WithItemConfig: Story = {
  args: {
    label: 'Fruit',
    placeholder: 'Select a fruit...',
  },
  render: (args) => ({
    components: {
      SelectConfigPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<SelectConfigPlayground v-bind="args" />',
  }),
}

export const MultiSelectWithItemConfig: Story = {
  args: {
    label: 'Users',
    placeholder: 'Select users...',
  },
  render: (args) => ({
    components: {
      SelectMultiConfigPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<SelectMultiConfigPlayground v-bind="args" />',
  }),
}

export const MultiSelect: Story = {
  args: {
    label: 'Fruits',
    placeholder: 'Select fruits...',
  },
  render: (args) => ({
    components: {
      SelectMultiPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<SelectMultiPlayground v-bind="args" />',
  }),
}
