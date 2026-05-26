import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import TableGroupedPlayground from './TableGroupedPlayground.vue'
import TablePlayground from './TablePlayground.vue'

const meta = {
  title: 'Components/Table',
  argTypes: {
    hasActiveSearch: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    activeFilterCount: {
      control: 'number',
    },
    disableColumnResize: {
      control: 'boolean',
    },
    variant: {
      control: 'select',
      options: [
        'full-page',
        'contained',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: TablePlayground,
} satisfies Meta<typeof TablePlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    hasActiveSearch: false,
    isLoading: false,
    activeFilterCount: 0,
    disableColumnResize: false,
    variant: 'full-page',
  },
}

export const Contained: Story = {
  args: {
    hasActiveSearch: false,
    isLoading: false,
    activeFilterCount: 0,
    disableColumnResize: false,
    variant: 'contained',
  },
}

export const Loading: Story = {
  args: {
    hasActiveSearch: false,
    isLoading: true,
    activeFilterCount: 0,
    disableColumnResize: false,
    variant: 'full-page',
  },
}

export const WithActiveSearch: Story = {
  args: {
    hasActiveSearch: true,
    isLoading: false,
    activeFilterCount: 0,
    disableColumnResize: false,
    variant: 'full-page',
  },
}

export const WithActiveFilters: Story = {
  args: {
    hasActiveSearch: false,
    isLoading: false,
    activeFilterCount: 3,
    disableColumnResize: false,
    variant: 'full-page',
  },
}

export const Grouped: Story = {
  args: {
    variant: 'full-page',
  },
  render: (args) => ({
    components: {
      TableGroupedPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TableGroupedPlayground v-bind="args" />',
  }),
}
