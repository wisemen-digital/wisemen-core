import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import AutocompletePlayground from './AutocompletePlayground.vue'

const meta = {
  title: 'Components/Autocomplete',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the autocomplete is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the autocomplete is in a loading state',
    },
    isReadonly: {
      control: 'boolean',
      description: 'Whether the autocomplete is read-only',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the autocomplete is required',
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
      description: 'The hint text of the autocomplete',
    },
    label: {
      control: 'text',
      description: 'The label of the autocomplete',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text of the autocomplete',
    },
    search: {
      control: 'select',
      description: 'The search mode of the autocomplete',
      options: [
        'local',
        'remote',
      ],
    },
    size: {
      control: 'select',
      description: 'The size of the autocomplete',
      options: [
        'sm',
        'md',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: AutocompletePlayground,
} satisfies Meta<typeof AutocompletePlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Fruit',
    placeholder: 'Search a fruit...',
  },
}

export const WithRemoteSearch: Story = {
  args: {
    label: 'Fruit',
    placeholder: 'Search a fruit...',
    search: 'remote',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    label: 'Fruit',
    placeholder: 'Search a fruit...',
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Please select a fruit',
    label: 'Fruit',
    placeholder: 'Search a fruit...',
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    label: 'Fruit',
    placeholder: 'Search a fruit...',
  },
}

export const SmallSize: Story = {
  args: {
    label: 'Fruit',
    placeholder: 'Search a fruit...',
    size: 'sm',
  },
}
