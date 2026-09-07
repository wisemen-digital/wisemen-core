/**
 * The selection state of a data table, expressed as either an explicit set of
 * selected item keys (`'include'`) or a set of deselected item keys against an
 * otherwise fully selected table (`'exclude'`).
 */
export type TableSelectionState
  = | {
    items: string[]
    type: 'exclude'
  }
  | {
    items: string[]
    type: 'include'
  }
