import type { DateTimeInstant } from '@wisemen/vue-core-dates'
import type { Component } from 'vue'

import type { Address } from '@/ui/address-autocomplete/addressAutocomplete.type'
import type { BadgeProps } from '@/ui/badge/badge.props'

export type DataTableTimestampGranularity = 'day' | 'hour' | 'minute' | 'month' | 'second' | 'year'

export type DataTableTimestampCell
  = | {
    isRelative: true
    fallback?: string
    value: DateTimeInstant | null
  }
  | {
    isRelative?: false
    fallback?: string
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

export interface DataTableCurrencyCell {
  /** ISO 4217 currency code, e.g. `'EUR'`. */
  currency: string
  fallback?: string
  value: number | null
}

export interface DataTableBooleanCell {
  fallback?: string
  /** Required — color/icon alone don't convey meaning to screen readers. */
  label: string
  value: boolean | null
}

export interface DataTableLongTextCell {
  fallback?: string
  value: string | null
}

export interface DataTableIdCell {
  fallback?: string
  maxLength?: number
  value: string | null
}

export type DataTableLocationPrecision = 'country' | 'municipality' | 'streetAndNumber'

export interface DataTableLocationCell {
  fallback?: string
  precision: DataTableLocationPrecision
  value: Address | null
}

export interface DataTableContactInfoCell {
  email?: string | string[]
  phoneNumber?: string | string[]
  website?: string | string[]
}

export interface DataTableAvatarCell {
  /** Falls back to initials generated from `label` when not provided. */
  avatarUrl?: string | null
  /** Shown in place of the avatar/label when `label` is `null`. */
  fallback?: string
  label: string | null
  /** Secondary line under the label — a role, team or phone number. */
  supportingText?: string | null
}

export type DataTableBadgeCell = Pick<
  BadgeProps,
  'color' | 'label' | 'left' | 'rounded' | 'size' | 'variant'
> & {
  /** Shown in place of the badge when `label` is `null`/empty. */
  fallback?: string
}

export interface DataTableBadgeGroupCell {
  badges: DataTableBadgeCell[]
  maxVisible?: number
}

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
    type: 'avatar'
  } & DataTableAvatarCell)
  | ({
    type: 'badge'
  } & DataTableBadgeCell)
  | ({
    type: 'badgeGroup'
  } & DataTableBadgeGroupCell)
  | ({
    type: 'boolean'
  } & DataTableBooleanCell)
  | ({
    type: 'contactInfo'
  } & DataTableContactInfoCell)
  | ({
    type: 'currency'
  } & DataTableCurrencyCell)
  | ({
    type: 'id'
  } & DataTableIdCell)
  | ({
    type: 'location'
  } & DataTableLocationCell)
  | ({
    type: 'longText'
  } & DataTableLongTextCell)
  | ({
    type: 'number'
  } & DataTableNumberCell)
  | ({
    type: 'text'
  } & DataTableTextCell)
  | ({
    type: 'timestamp'
  } & DataTableTimestampCell)
  | DataTableCustomCell<unknown>
