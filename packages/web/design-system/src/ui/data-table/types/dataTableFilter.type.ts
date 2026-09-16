/**
 * Describes a filter icon rendered in a data-table column header. The consumer owns the filter
 * editor and data query; DataTable only renders the icon and emits its column key on click.
 */
export interface DataTableFilter {
  /** Applies the active treatment to the icon while this column has a filter applied. */
  isActive?: boolean
  /** Announces the filter's purpose to assistive technology and appears in its tooltip. */
  label: string
}

/** Filter configuration keyed by the corresponding `DataTableColumn.key`. */
export type DataTableFilters = Partial<Record<string, DataTableFilter>>
