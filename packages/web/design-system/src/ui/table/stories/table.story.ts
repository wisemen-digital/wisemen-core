import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import TableGroupedPlayground from './TableGroupedPlayground.vue'
import TableInfiniteScrollPlayground from './TableInfiniteScrollPlayground.vue'
import TablePlayground from './TablePlayground.vue'
import TableSelectionGroupedPlayground from './TableSelectionGroupedPlayground.vue'
import TableSelectionPlayground from './TableSelectionPlayground.vue'
import TableSortingPlayground from './TableSortingPlayground.vue'

const meta = {
  title: 'Components/Table',
  argTypes: {
    hasActiveSearch: {
      control: 'boolean',
    },
    isColumnResizeDisabled: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    activeFilterCount: {
      control: 'number',
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
    isColumnResizeDisabled: false,
    isLoading: false,
    activeFilterCount: 0,
    variant: 'full-page',
  },
}

export const Contained: Story = {
  args: {
    hasActiveSearch: false,
    isColumnResizeDisabled: false,
    isLoading: false,
    activeFilterCount: 0,
    variant: 'contained',
  },
}

export const Loading: Story = {
  args: {
    hasActiveSearch: false,
    isColumnResizeDisabled: false,
    isLoading: true,
    activeFilterCount: 0,
    variant: 'full-page',
  },
}

export const WithActiveSearch: Story = {
  args: {
    hasActiveSearch: true,
    isColumnResizeDisabled: false,
    isLoading: false,
    activeFilterCount: 0,
    variant: 'full-page',
  },
}

export const WithActiveFilters: Story = {
  args: {
    hasActiveSearch: false,
    isColumnResizeDisabled: false,
    isLoading: false,
    activeFilterCount: 3,
    variant: 'full-page',
  },
}

export const Sorting: Story = {
  args: {
    variant: 'full-page',
  },
  render: (args) => ({
    components: {
      TableSortingPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TableSortingPlayground v-bind="args" />',
  }),
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

export const Selection: Story = {
  args: {
    variant: 'full-page',
  },
  render: (args) => ({
    components: {
      TableSelectionPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TableSelectionPlayground v-bind="args" />',
  }),
}

export const SelectionGrouped: Story = {
  args: {
    variant: 'full-page',
  },
  render: (args) => ({
    components: {
      TableSelectionGroupedPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TableSelectionGroupedPlayground v-bind="args" />',
  }),
}

export const InfiniteScroll: Story = {
  args: {
    variant: 'full-page',
  },
  render: (args) => ({
    components: {
      TableInfiniteScrollPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TableInfiniteScrollPlayground v-bind="args" />',
  }),
}
