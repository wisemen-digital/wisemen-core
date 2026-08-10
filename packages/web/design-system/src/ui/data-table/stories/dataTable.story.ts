import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import DataTablePlayground from './DataTablePlayground.vue'

const STICKY_COLUMN_KEY_OPTIONS = [
  'name',
  'id',
  'status',
  'balance',
  'department',
  'lastActiveAt',
  'startDate',
  'contact',
  'manager',
]

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
    stickyLeftColumnKeys: {
      control: 'check',
      options: STICKY_COLUMN_KEY_OPTIONS,
    },
    stickyRightColumnKeys: {
      control: 'check',
      options: STICKY_COLUMN_KEY_OPTIONS,
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
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
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
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

// Demonstrates a column pinned left by key (`DataTableColumn.isSticky`) stacking with the
// default-sticky first column as one contiguous sticky-left region, plus selection so the
// checkbox leading column joins that same region too — scroll horizontally to see the
// checkbox, Name, and Status columns all stick together with a single trailing border on
// Status, not three independently-bordered columns.
export const StickyColumnByKey: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: true,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    stickyLeftColumnKeys: [
      'status',
    ],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

// A column can pin to either side independent of `isFirstColumnSticky`/`isLastColumnSticky` —
// Status pins left (stacking with the checkbox/Name sticky-left region) while Balance pins
// right at the same time, with no `isLastColumnSticky`. Scroll horizontally to see both
// sticky-left and sticky-right regions holding in place simultaneously, each with its own
// single boundary border, while the columns between them scroll normally.
export const StickyColumnsBothSides: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: true,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    stickyLeftColumnKeys: [
      'status',
    ],
    stickyRightColumnKeys: [
      'balance',
    ],
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
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
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
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
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
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
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
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
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
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
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
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
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
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}
