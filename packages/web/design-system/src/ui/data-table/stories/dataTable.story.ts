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
    isForcedLoading: {
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
    isSimulatingEmpty: {
      control: 'boolean',
    },
    isSimulatingError: {
      control: 'boolean',
    },
    isSimulatingInfiniteScroll: {
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
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

export const StickyColumns: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: true,
    isForcedLoading: false,
    isLastColumnSticky: true,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
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
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
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
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
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
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: 'department',
  },
}

export const GroupedTwoLevels: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: 'department+status',
  },
}

export const SubComponent: Story = {
  args: {
    hasSubComponent: true,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

export const Selectable: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

export const SelectableGrouped: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: 'department',
  },
}

export const Mobile: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: true,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

export const MobileSelectable: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: true,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

// Starts with a small page of the mock dataset and reveals more via `onNextPage` (simulated
// fetch delay) as you scroll toward the bottom — exercises the real trigger path, not just
// `isFetchingNextPage`'s static visual. Selection is on with `totalCount` set, so selecting all
// shows the true 200 total instead of just the currently-loaded page count.
export const InfiniteScroll: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: true,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: true,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

// No data has arrived yet — renders the skeleton in place of rows, header still visible.
export const Loading: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: true,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

// The fetch failed — replaces the row area with the default `UIErrorState` (or a consumer's
// `#error` slot).
export const ErrorState: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: true,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}

// The fetch succeeded but matched nothing — renders the default `UIEmptyState`.
export const Empty: Story = {
  args: {
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: true,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    groupBy: null,
  },
}
