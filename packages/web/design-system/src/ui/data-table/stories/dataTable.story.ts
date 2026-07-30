import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import DataTablePlayground from './DataTablePlayground.vue'

const meta = {
  title: 'Components/DataTable',
  argTypes: {
    hasSubComponent: {
      control: 'boolean',
    },
    isFirstColumnSticky: {
      control: 'boolean',
    },
    isLastColumnSticky: {
      control: 'boolean',
    },
    isNarrow: {
      control: 'boolean',
    },
    isSelectable: {
      control: 'boolean',
    },
    groupBy: {
      control: 'select',
      options: [
        null,
        'department',
        'status',
        'department+status',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: DataTablePlayground,
} satisfies Meta<typeof DataTablePlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    groupBy: null,
  },
}

export const StickyColumns: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: true,
    isLastColumnSticky: true,
    isNarrow: false,
    isSelectable: false,
    groupBy: null,
  },
}

export const Grouped: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    groupBy: 'department',
  },
}

export const GroupedTwoLevels: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    groupBy: 'department+status',
  },
}

export const SubComponent: Story = {
  args: {
    hasSubComponent: true,
    isFirstColumnSticky: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    groupBy: null,
  },
}

export const Selectable: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    groupBy: null,
  },
}

export const SelectableGrouped: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    groupBy: 'department',
  },
}

export const Mobile: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isLastColumnSticky: false,
    isNarrow: true,
    isSelectable: false,
    groupBy: null,
  },
}

export const MobileSelectable: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isLastColumnSticky: false,
    isNarrow: true,
    isSelectable: true,
    groupBy: null,
  },
}
