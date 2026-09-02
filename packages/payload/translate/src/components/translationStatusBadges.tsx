/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
'use client'

import { Pill } from '@payloadcms/ui'
import React from 'react'

import type { TranslationStatus } from '#status.ts'
import {
  TRANSLATION_STATUS_LABELS,
  TRANSLATION_STATUSES,
} from '#status.ts'

const STATUS_PILL_STYLES: Record<TranslationStatus, React.ComponentProps<typeof Pill>['pillStyle']> = {
  [TRANSLATION_STATUSES.manuallyEdited]: 'light',
  [TRANSLATION_STATUSES.notTranslated]: 'light-gray',
  [TRANSLATION_STATUSES.staleTranslation]: 'warning',
  [TRANSLATION_STATUSES.translated]: 'success',
}

interface TranslationStatusBadgesProps {
  isLoading?: boolean
  locales: {
    code: string
    label: string
  }[]
  statuses: Record<string, TranslationStatus>
}

export function TranslationStatusBadges({
  isLoading = false,
  locales,
  statuses,
}: TranslationStatusBadgesProps) {
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.375rem',
        minHeight: '1.5rem',
      }}
      >
        {[
          'Loading status',
          'Loading locales',
        ].map((label) => (
          <Pill
            aria-label={label}
            key={label}
            pillStyle="light-gray"
            rounded={true}
            size="small"
          >
            <span style={{
              display: 'inline-block',
              minWidth: label === 'Loading status' ? '9rem' : '8rem',
              opacity: 0.55,
            }}
            >
              {label}
            </span>
          </Pill>
        ))}
      </div>
    )
  }

  const groupedStatuses = [
    TRANSLATION_STATUSES.staleTranslation,
    TRANSLATION_STATUSES.manuallyEdited,
    TRANSLATION_STATUSES.notTranslated,
    TRANSLATION_STATUSES.translated,
  ].map((status) => ({
    locales: locales.filter((locale) => statuses[locale.code] === status),
    status,
  })).filter((group) => group.locales.length > 0)

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.375rem',
      minHeight: '1.5rem',
    }}
    >
      {groupedStatuses.map((group) => {
        const localeCodes = group.locales.map((locale) => locale.code.toUpperCase()).join(', ')
        const localeLabels = group.locales.map((locale) => locale.label).join(', ')

        return (
          <Pill
            aria-label={`${localeLabels}: ${TRANSLATION_STATUS_LABELS[group.status]}`}
            key={group.status}
            pillStyle={STATUS_PILL_STYLES[group.status]}
            rounded={true}
            size="small"
          >
            {localeCodes}
            {' · '}
            {TRANSLATION_STATUS_LABELS[group.status]}
          </Pill>
        )
      })}
    </div>
  )
}
