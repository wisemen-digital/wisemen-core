import type { DateTimeInstant } from '@wisemen/vue-core-dates'
import type { Component } from 'vue'

import type { Address } from '@/ui/address-autocomplete/addressAutocomplete.type'
import type { BadgeProps } from '@/ui/badge/badge.props'

export type DataTableTimestampGranularity = 'day' | 'hour' | 'minute' | 'month' | 'second' | 'year'

export type DataTableTimestampCell
  = | {
    isRelative: true
    value: DateTimeInstant | null
  }
  | {
    isRelative?: false
    granularity?: DataTableTimestampGranularity
    value: DateTimeInstant | null
  }

export interface DataTableTextCell {
  fallback?: string
  value: string | null
}

export interface DataTableNumberCell {
  fallback?: string
  formatOptions?: Intl.NumberFormatOptions
  value: number | null
}

export interface DataTableIdCell {
  maxLength?: number
  value: string | null
}

export type DataTableLocationPrecision = 'country' | 'municipality' | 'streetAndNumber'

export interface DataTableLocationCell {
  precision: DataTableLocationPrecision
  value: Address | null
}

export interface DataTableContactInfoCell {
  phoneNumber?: string | string[]
  website?: string | string[]
}

export interface DataTablePersonCell {
  name: string | null
  /** Falls back to initials generated from `name` when not provided. */
  avatarUrl?: string | null
  /** Secondary line under the name — a role, team or phone number. */
  supportingText?: string | null
}

export type DataTableBadgeCell = Pick<
  BadgeProps,
  'color' | 'label' | 'left' | 'rounded' | 'size' | 'variant'
>

export interface DataTableCustomCellConfig<TValue> {
  cellComponent: (value: TValue) => Component
  detailListComponent: (value: TValue) => Component
}

export interface DataTableCustomCell<TValue> {
  config: DataTableCustomCellConfig<TValue>
  type: 'custom'
  value: TValue
}

export function createCustomCell<TValue>(
  config: DataTableCustomCellConfig<TValue>,
): (value: TValue) => DataTableCustomCell<TValue> {
  return (value) => ({
    config,
    type: 'custom',
    value,
  })
}

export type DataTableCell
  = | ({
    type: 'badge'
  } & DataTableBadgeCell)
  | ({
    type: 'contactInfo'
  } & DataTableContactInfoCell)
  | ({
    type: 'id'
  } & DataTableIdCell)
  | ({
    type: 'location'
  } & DataTableLocationCell)
  | ({
    type: 'number'
  } & DataTableNumberCell)
  | ({
    type: 'person'
  } & DataTablePersonCell)
  | ({
    type: 'text'
  } & DataTableTextCell)
  | ({
    type: 'timestamp'
  } & DataTableTimestampCell)
  | DataTableCustomCell<unknown>
