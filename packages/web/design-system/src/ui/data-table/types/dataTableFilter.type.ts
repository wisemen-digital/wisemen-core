/**
 * Describes a filter rendered in a data-table column header. DataTable owns the icon's
 * presentation; the caller owns opening the editor and updating the query.
 */
export interface DataTableFilter {
  /** Applies the active treatment to the icon while this column has a filter applied. */
  isActive?: boolean
  /** Announces the filter's purpose to assistive technology and appears in its tooltip. */
  label: string
  /** Opens this column's filter editor. */
  open: () => void
}

/** Filter configuration keyed by the corresponding `DataTableColumn.key`. */
export type DataTableFilters = Partial<Record<string, DataTableFilter>>
