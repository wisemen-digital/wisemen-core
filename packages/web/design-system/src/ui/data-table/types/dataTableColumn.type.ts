import type {
  DataTableBadgeCell,
  DataTableCell,
  DataTableContactInfoCell,
  DataTableCustomCellConfig,
  DataTableIdCell,
  DataTableLocationCell,
  DataTableNumberCell,
  DataTableTextCell,
  DataTableTimestampCell,
} from '@/ui/data-table/types/dataTableCell.type'

export interface DataTableColumn<TItem, TKey extends string = string> {
  /**
   * Describes how this column's value should be displayed. The `Cell definition`
   * returned here is presentation-agnostic — the same definition is reused by the
   * detail pane and mobile list, not just the table body.
   */
  cell: (item: TItem) => DataTableCell
  /**
   * The `Cell definition` type this column always renders. Declared explicitly (rather than
   * derived from calling `cell` on a row) so the column's default width is known immediately,
   * even before any data has loaded — see `CONTEXT.md` ("Column sizing — fixed pixel default
   * per cell type"). Always produced together with `cell` by the same `createXCell` factory
   * (see `dataTableColumnFactories.ts`), so the two can never drift out of sync.
   */
  cellType: DataTableCell['type']
  headerLabel: string
  key: TKey
  /**
   * Fixed pixel width overriding this column's cell-type default. Manual drag-resize still
   * applies on top of whichever width — default or overridden — the column starts at.
   */
  size?: number
}

export function defineDataTableColumns<TItem>() {
  // eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
  return <const TKey extends string>(columns: DataTableColumn<TItem, TKey>[]) => columns
}

export type InferDataTableColumnKeys<T extends { key: string }[]> = T[number]['key']

interface DataTableColumnFactoryBaseOptions<TKey extends string> {
  headerLabel: string
  key: TKey
  size?: number
}

export interface CreateDataTableTextCellOptions<TItem, TKey extends string>
  extends DataTableColumnFactoryBaseOptions<TKey> {
  value: (item: TItem) => DataTableTextCell
}

export function createDataTableTextCell<TItem, TKey extends string>(
  options: CreateDataTableTextCellOptions<TItem, TKey>,
): DataTableColumn<TItem, TKey> {
  return {
    cell: (item) => ({
      type: 'text',
      ...options.value(item),
    }),
    cellType: 'text',
    headerLabel: options.headerLabel,
    key: options.key,
    size: options.size,
  }
}

export interface CreateDataTableNumberCellOptions<TItem, TKey extends string>
  extends DataTableColumnFactoryBaseOptions<TKey> {
  value: (item: TItem) => DataTableNumberCell
}

export function createDataTableNumberCell<TItem, TKey extends string>(
  options: CreateDataTableNumberCellOptions<TItem, TKey>,
): DataTableColumn<TItem, TKey> {
  return {
    cell: (item) => ({
      type: 'number',
      ...options.value(item),
    }),
    cellType: 'number',
    headerLabel: options.headerLabel,
    key: options.key,
    size: options.size,
  }
}

export interface CreateDataTableIdCellOptions<TItem, TKey extends string>
  extends DataTableColumnFactoryBaseOptions<TKey> {
  value: (item: TItem) => DataTableIdCell
}

export function createDataTableIdCell<TItem, TKey extends string>(
  options: CreateDataTableIdCellOptions<TItem, TKey>,
): DataTableColumn<TItem, TKey> {
  return {
    cell: (item) => ({
      type: 'id',
      ...options.value(item),
    }),
    cellType: 'id',
    headerLabel: options.headerLabel,
    key: options.key,
    size: options.size,
  }
}

export interface CreateDataTableLocationCellOptions<TItem, TKey extends string>
  extends DataTableColumnFactoryBaseOptions<TKey> {
  value: (item: TItem) => DataTableLocationCell
}

export function createDataTableLocationCell<TItem, TKey extends string>(
  options: CreateDataTableLocationCellOptions<TItem, TKey>,
): DataTableColumn<TItem, TKey> {
  return {
    cell: (item) => ({
      type: 'location',
      ...options.value(item),
    }),
    cellType: 'location',
    headerLabel: options.headerLabel,
    key: options.key,
    size: options.size,
  }
}

export interface CreateDataTableContactInfoCellOptions<TItem, TKey extends string>
  extends DataTableColumnFactoryBaseOptions<TKey> {
  value: (item: TItem) => DataTableContactInfoCell
}

export function createDataTableContactInfoCell<TItem, TKey extends string>(
  options: CreateDataTableContactInfoCellOptions<TItem, TKey>,
): DataTableColumn<TItem, TKey> {
  return {
    cell: (item) => ({
      type: 'contactInfo',
      ...options.value(item),
    }),
    cellType: 'contactInfo',
    headerLabel: options.headerLabel,
    key: options.key,
    size: options.size,
  }
}

export interface CreateDataTableBadgeCellOptions<TItem, TKey extends string>
  extends DataTableColumnFactoryBaseOptions<TKey> {
  value: (item: TItem) => DataTableBadgeCell
}

export function createDataTableBadgeCell<TItem, TKey extends string>(
  options: CreateDataTableBadgeCellOptions<TItem, TKey>,
): DataTableColumn<TItem, TKey> {
  return {
    cell: (item) => ({
      type: 'badge',
      ...options.value(item),
    }),
    cellType: 'badge',
    headerLabel: options.headerLabel,
    key: options.key,
    size: options.size,
  }
}

export interface CreateDataTableTimestampCellOptions<TItem, TKey extends string>
  extends DataTableColumnFactoryBaseOptions<TKey>
{
  value: (item: TItem) => DataTableTimestampCell
}

export function createDataTableTimestampCell<TItem, TKey extends string>(
  options: CreateDataTableTimestampCellOptions<TItem, TKey>,
): DataTableColumn<TItem, TKey> {
  return {
    cell: (item) => ({
      type: 'timestamp',
      ...options.value(item),
    }),
    cellType: 'timestamp',
    headerLabel: options.headerLabel,
    key: options.key,
    size: options.size,
  }
}

export interface CreateDataTableCustomCellOptions<TItem, TKey extends string, TValue>
  extends DataTableColumnFactoryBaseOptions<TKey>
{
  config: DataTableCustomCellConfig<TValue>
  value: (item: TItem) => TValue
}

export function createDataTableCustomCell<TItem, TKey extends string, TValue>(
  options: CreateDataTableCustomCellOptions<TItem, TKey, TValue>,
): DataTableColumn<TItem, TKey> {
  return {
    cell: (item) => ({
      config: options.config as DataTableCustomCellConfig<unknown>,
      type: 'custom',
      value: options.value(item),
    }),
    cellType: 'custom',
    headerLabel: options.headerLabel,
    key: options.key,
    size: options.size,
  }
}
