import type { Action } from '@wisemen/vue-core-actions'
import type { Component } from 'vue'

import type { RegisteredActionContext } from '@/register'

type Unit = '%' | 'fr' | 'rem'
type Size = 'auto' | 'min-content' | `${number}${Unit}`

export interface TableColumnSize {
  max: Size
  min: Size
}

type InferColumnItem<T>
  = T extends TableGroupedData<infer TItem> ? TItem
    : T extends TableSubGroupedData<infer TItem> ? TItem
      : T

export interface TableColumn<TElement, TKey extends string = string> {
  actionConfig?: {
    actions: Action[]
    metadata?: RegisteredActionContext['metadata']
  }
  centerHeaderContent?: boolean
  headerLabel: string
  key: TKey
  size?: TableColumnSize
  component: (data: InferColumnItem<TElement>) => Component
}

export type TableFlatData<T> = T

export interface TableGroupedData<T> {
  defaultOpen?: boolean
  items: T[]
  key: string
  label: string
}

export interface TableSubGroupedData<T> {
  defaultOpen?: boolean
  key: string
  label: string
  subGroups: {
    defaultOpen?: boolean
    items: T[]
    key: string
    label: string
  }[]
}

export type TableData<T> = TableFlatData<T>[] | TableGroupedData<T>[] | TableSubGroupedData<T>[]

export function defineColumns<TElement>() {
  // eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
  return <const TKey extends string>(columns: TableColumn<TElement, TKey>[]) => columns
}

export type InferTableItem<T>
  = T extends TableGroupedData<infer TItem>[] ? TItem
    : T extends TableSubGroupedData<infer TItem>[] ? TItem
      : T extends (infer TItem)[] ? TItem
        : never

export type InferTableColumnKeys<T extends { key: string }[]> = T[number]['key']

export type TableSelectionState<T>
  = | {
    items: T[]
    type: 'excludes'
  }
  | {
    items: T[]
    type: 'includes'
  }
