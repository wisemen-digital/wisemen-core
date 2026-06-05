<!-- This file was automatically generated. Do not edit it manually -->

<script lang="ts">
const propsData = [
  {
    "description": "<p>An action group displayed in the table toolbar, typically shown when one or more\nrows are selected.</p>\n",
    "name": "actionGroup",
    "required": false,
    "type": "ActionGroup<any> | null"
  },
  {
    "description": "<p>Row-level actions available in the context menu or action column for each row.</p>\n",
    "name": "actions",
    "required": false,
    "type": "Action<any>[]"
  },
  {
    "default": "0",
    "description": "<p>Number of filters currently active. Displayed as a badge on the filter button\nso users can see at a glance how many filters are applied.</p>\n",
    "name": "activeFilterCount",
    "required": false,
    "type": "number"
  },
  {
    "description": "<p>Column definitions that describe each column's header label, unique key, cell component,\noptional size constraints, and optional per-column actions.</p>\n",
    "name": "columns",
    "required": true,
    "type": "TableColumn<TTableData extends (infer TElement)[] ? TElement : never, string>[]"
  },
  {
    "description": "<p>The data to render. Supports three shapes:</p>\n<ul>\n<li>Flat array — renders a plain list of rows.</li>\n<li><code>TableGroupedData[]</code> — renders collapsible row groups with a label row.</li>\n<li><code>TableSubGroupedData[]</code> — renders nested collapsible groups.</li>\n</ul>\n",
    "name": "data",
    "required": true,
    "type": "TTableData"
  },
  {
    "description": "<p>When <code>true</code>, the column resize handles are hidden and users cannot drag to resize columns.</p>\n",
    "name": "disableColumnResize",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Error returned by the data fetch, or <code>null</code> when there is no error. When non-null\nthe table renders an error state instead of rows.</p>\n",
    "name": "error",
    "required": true,
    "type": "ApiError | null"
  },
  {
    "description": "<p>Maps a row item to the action context model used by the actions system. Required when\n<code>actions</code> is provided so the action handlers receive the correct model. Set to <code>null</code>\nto explicitly disable per-row action context.</p>\n",
    "name": "getActionModel",
    "required": false,
    "type": "((item: InferTableItem<TTableData>) => ActionModel) | null"
  },
  {
    "description": "<p>Returns a stable, unique key for a row item. Used by Vue's virtual DOM to track rows\nacross re-renders — must be unique per item within the data set.</p>\n",
    "name": "getKey",
    "required": true,
    "type": "(item: InferTableItem<TTableData>) => string"
  },
  {
    "default": "null",
    "description": "<p>Maps a row item to a route location, making the entire row a clickable link.\nReturn <code>null</code> to disable linking for a specific row.\nWhen using other interactable elements inside a cell, wrap them with <code>UITableCellInteractiveElement</code>\nto prevent click events from triggering the row link.</p>\n",
    "name": "getLink",
    "required": false,
    "type": "((item: InferTableItem<TTableData>) => string | kt | Tt | null) | null"
  },
  {
    "description": "<p>Returns an array of Vue components to render inside a group's header row. Use this to\nadd custom summary cells (e.g. totals) aligned with the table columns for grouped data.</p>\n",
    "name": "groupHeaderCells",
    "required": false,
    "type": "((group: TableGroupedData<InferTableItem<TTableData>>) => Component[])"
  },
  {
    "description": "<p>Whether a search query is currently active. When <code>true</code>, the empty state will\nindicate no results were found for the search instead of showing the generic empty state.</p>\n",
    "name": "hasActiveSearch",
    "required": false,
    "type": "boolean"
  },
  {
    "description": "<p>Actions rendered in the table header toolbar (top-right area), independent of row selection.</p>\n",
    "name": "headerActions",
    "required": false,
    "type": "Action<any>[]"
  },
  {
    "description": "<p>Whether the next page of results is currently being fetched. Shows a loading indicator\nat the bottom of the table while paginating.</p>\n",
    "name": "isFetchingNextPage",
    "required": true,
    "type": "boolean"
  },
  {
    "description": "<p>Whether the initial data fetch is in progress. Shows a full-table loading skeleton\nuntil the first set of rows is ready.</p>\n",
    "name": "isLoading",
    "required": true,
    "type": "boolean"
  },
  {
    "description": "<p>Called when the user scrolls to the bottom of the table. Implement to fetch the next\npage of data for infinite-scroll pagination. Omit when all data is loaded at once.</p>\n",
    "name": "onNextPage",
    "required": false,
    "type": "(() => void)"
  },
  {
    "description": "<p>Sort state returned by <code>useSort</code>. When provided, column headers whose <code>key</code> matches\none of the sortable keys become clickable and display a sort direction indicator.\nClicking a header cycles through <code>asc → desc → unsorted</code>. Pass <code>null</code> or omit to\ndisable sorting entirely.</p>\n",
    "name": "sort",
    "required": false,
    "type": "Sort<string> | null"
  },
  {
    "description": "<p>Visual style variant of the table.</p>\n<ul>\n<li><code>contained</code> — table has a border and rounded corners, suitable for embedding inside a page.</li>\n<li><code>full-page</code> — table stretches edge-to-edge, suitable for full-page list views.</li>\n</ul>\n",
    "name": "variant",
    "required": false,
    "type": "\"contained\" | \"full-page\""
  }
]

const eventsData = [
  {
    "description": "",
    "name": "clearFilters",
    "type": "[]"
  },
  {
    "description": "",
    "name": "clearSearch",
    "type": "[]"
  }
]

const slotsData = [
  {
    "name": "error",
    "type": "{ error: ApiError; }"
  }
]

export default {
  setup() {
    return {
      propsData,
      eventsData,
      slotsData,
    }
  },
}
</script>

<PropsTable :data="propsData" />

<EmitsTable :data="eventsData" />

<SlotsTable :data="slotsData" />