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
    hasCellTypes: {
      control: 'boolean',
      description: 'Adds every built-in cell type to the base columns.',
    },
    hasRowActions: {
      control: 'boolean',
      description: 'Adds inline and overflow actions to each row.',
    },
    hasSubComponent: {
      control: 'boolean',
      description: 'Lets active rows expand to reveal extra content.',
    },
    isFirstColumnSticky: {
      control: 'boolean',
      description: 'Keeps the first data column visible while scrolling horizontally.',
    },
    isForcedLoading: {
      control: 'boolean',
      description: 'Shows the initial loading skeleton instead of table data.',
    },
    isLastColumnSticky: {
      control: 'boolean',
      description: 'Keeps the last data column visible while scrolling horizontally.',
    },
    isNarrow: {
      control: 'boolean',
      description: 'Constrains the table to demonstrate its mobile card layout.',
    },
    isSelectable: {
      control: 'boolean',
      description: 'Adds row-selection controls and the selection action bar.',
    },
    isSimulatingCustomEmptyState: {
      control: 'boolean',
      description: 'Uses a custom empty-state title, description, and illustration.',
    },
    isSimulatingEmpty: {
      control: 'boolean',
      description: 'Removes all rows to show the empty state.',
    },
    isSimulatingError: {
      control: 'boolean',
      description: 'Replaces the row area with the error state.',
    },
    isSimulatingInfiniteScroll: {
      control: 'boolean',
      description: 'Loads mock rows in pages as the table is scrolled.',
    },
    filterExample: {
      control: 'select',
      description: 'Renders one filter category through the table filter API.',
      options: [
        null,
        'boolean',
        'multi-select',
        'multi-autocomplete',
      ],
    },
    groupBy: {
      control: 'select',
      description: 'Groups rows by one or two table columns.',
      options: [
        null,
        'department',
        'status',
        'department+status',
      ],
    },
    stickyLeftColumnKeys: {
      control: 'check',
      description: 'Pins the selected columns to the left edge.',
      options: STICKY_COLUMN_KEY_OPTIONS,
    },
    stickyRightColumnKeys: {
      control: 'check',
      description: 'Pins the selected columns to the right edge.',
      options: STICKY_COLUMN_KEY_OPTIONS,
    },
    variant: {
      control: 'select',
      description: 'Chrome only: \'contained\' wraps the table in a rounded bordered card, \'full-page\' renders edge-to-edge with no border/rounding.',
      options: [
        'contained',
        'full-page',
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
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

export const StickyColumns: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: true,
    isForcedLoading: false,
    isLastColumnSticky: true,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// A Boolean filter toggles directly on the Status header and uses project-owned state.
export const BooleanFilter: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    filterExample: 'boolean',
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// Multi Select and Multi Autocomplete filters can be used together from the Department and
// Manager headers.
export const MultiSelectFilter: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    filterExample: 'multi-select',
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// A Multi Autocomplete filter uses a searchable project-owned dialog from the Manager header.
export const MultiAutocompleteFilter: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    filterExample: 'multi-autocomplete',
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// Demonstrates a column pinned left by key (`DataTableColumn.isSticky`) stacking with the
// default-sticky first column as one contiguous sticky-left region, plus selection so the
// checkbox leading column joins that same region too — scroll horizontally to see the
// checkbox, Name, and Status columns all stick together with a single trailing border on
// Status, not three independently-bordered columns.
export const StickyColumnByKey: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: true,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [
      'status',
    ],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// A column can pin to either side independent of `isFirstColumnSticky`/`isLastColumnSticky` —
// Status pins left (stacking with the checkbox/Name sticky-left region) while Balance pins
// right at the same time, with no `isLastColumnSticky`. Scroll horizontally to see both
// sticky-left and sticky-right regions holding in place simultaneously, each with its own
// single boundary border, while the columns between them scroll normally.
export const StickyColumnsBothSides: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: true,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [
      'status',
    ],
    stickyRightColumnKeys: [
      'balance',
    ],
    variant: 'contained',
  },
}

export const Grouped: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: 'department',
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

export const GroupedTwoLevels: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: 'department+status',
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

export const SubComponent: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: true,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// Same subComponent content as the desktop story, on the mobile card layout — expand a card to
// see the columns not slotted into mobileCard, followed by the subComponent content, both inside
// the same expanded area behind one chevron.
export const SubComponentMobile: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: true,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: true,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

export const Selectable: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

export const SelectableGrouped: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: 'department',
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

export const Mobile: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: true,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

export const MobileSelectable: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: true,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// Starts with a small page of the mock dataset and reveals more via `onNextPage` (simulated
// fetch delay) as you scroll toward the bottom — exercises the real trigger path, not just
// `isFetchingNextPage`'s static visual. Selection is on with `totalCount` set, so selecting all
// shows the true 200 total instead of just the currently-loaded page count.
export const InfiniteScroll: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: true,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: true,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: true,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// No data has arrived yet — renders the skeleton in place of rows, header still visible.
export const Loading: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: true,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// The fetch failed — replaces the row area with the default `UIErrorState` (or a consumer's
// `#error` slot).
export const ErrorState: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: true,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// The fetch succeeded but matched nothing — renders the default `UIEmptyState`.
export const Empty: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: true,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// Same empty state as `Empty`, but wrapped in a dashboard-widget-style card, the way a dashboard
// grid embeds a `contained` table. The wrapper sizes itself to content (`h-fit`, not a hard
// `overflow-hidden` height) so the table's own `min-h-64` floor determines the card's height
// instead of being clipped by it — the empty-state overlay stays fully visible. A consumer that
// hard-clips a shorter box from the outside defeats this: the overlay can only scroll within the
// table's own bounds, not past an ancestor's clip.
export const EmptyContained: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: true,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
  render: (args) => ({
    components: {
      DataTablePlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: `
      <div class="flex h-fit max-w-2xl flex-col rounded-xl border border-secondary p-lg">
        <p class="mb-lg shrink-0 text-sm font-semibold text-secondary">
          Open issues &amp; preventive maintenance
        </p>
        <div class="flex flex-col [&>div]:h-auto">
          <DataTablePlayground v-bind="args" />
        </div>
      </div>
    `,
  }),
}

// Overrides the default "No data" empty state via the `emptyState` prop (title, description,
// illustration) — see `DataTablePlayground.vue`'s `emptyState` computed for the exact override.
export const EmptyCustom: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingCustomEmptyState: true,
    isSimulatingEmpty: true,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// Each row resolves a `row()` config: a click handler (logged to the console), a "View" inline
// icon button, and a "Delete" action behind the trailing `⋯` overflow menu — hover a row to
// reveal both, or right-click anywhere on the row for the same actions in a context menu.
export const RowActions: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: true,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}

// 'full-page' drops the rounded border/card chrome for an edge-to-edge table — e.g. when a
// page's own layout already provides the frame. Row height, row borders, and empty/error state
// content are unaffected; only the outer border/rounding differs from `Default`.
export const FullPage: Story = {
  args: {
    hasCellTypes: false,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'full-page',
  },
}

// Showcases every predefined cell type together (Currency, Boolean, LongText, BadgeGroup, the
// Avatar-renamed Contact column, ContactInfo's icon-only popover redesign, and Location's
// address-card popover) — appended on top of the base columns via `hasCellTypes`, see
// `DataTablePlayground.vue`'s `cellTypeColumns`.
export const CellTypes: Story = {
  args: {
    hasCellTypes: true,
    hasRowActions: false,
    hasSubComponent: false,
    isFirstColumnSticky: false,
    isForcedLoading: false,
    isLastColumnSticky: false,
    isNarrow: false,
    isSelectable: false,
    isSimulatingEmpty: false,
    isSimulatingError: false,
    isSimulatingInfiniteScroll: false,
    groupBy: null,
    stickyLeftColumnKeys: [],
    stickyRightColumnKeys: [],
    variant: 'contained',
  },
}
