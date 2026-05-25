import type { ApiError } from '@wisemen/vue-core-api-utils'
import type { Component } from 'vue'

import type { RegisteredActionContext } from '@/register'
import type {
  InferTableItem,
  TableColumn,
  TableData,
  TableGroupedData,
} from '@/ui/table/types/table.type'
import type { TableRootProps } from '@/ui/table/types/tableRoot.props'

export interface TableProps<TData extends TableData<unknown>> extends Omit<TableRootProps, 'columnSizes' | 'isInitialized'> {
  isFetchingNextPage: boolean
  isLoading: boolean
  columns: TableColumn<TData extends (infer TElement)[] ? TElement : never>[]
  data: TData
  error: ApiError | null
  getActionModel?: ((item: InferTableItem<TData>) => RegisteredActionContext['models'][number]) | null
  getKey: (item: InferTableItem<TData>) => string
  groupHeaderCells?: (group: TableGroupedData<InferTableItem<TData>>) => Component[]
}
