/* eslint-disable require-await */
/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
'use client'

import {
  useConfig,
  useDocumentInfo,
  useLocale,
} from '@payloadcms/ui'
import type { SelectFieldClientProps } from 'payload'
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { TranslationStatusBadges } from '#components/translationStatusBadges.tsx'
import {
  normalizeTranslationStatus,
  resolveTranslationStatusMap,
  TRANSLATION_STATUS_FIELD_NAME,
} from '#status.ts'

interface LocaleOption {
  code: string
  label: string
}

interface TranslationStatusFieldProps extends SelectFieldClientProps {
  readonly field: SelectFieldClientProps['field'] & {
    admin?: {
      custom?: {
        collectionSlug?: string
      }
    }
  }
}

export function TranslationStatusField({
  field, value,
}: TranslationStatusFieldProps) {
  const {
    config,
  } = useConfig()
  const {
    id, lastUpdateTime,
  } = useDocumentInfo()
  const locale = useLocale()
  const locales = useMemo(() => getLocales(config, locale.code), [
    config,
    locale.code,
  ])
  const localeCodes = useMemo(() => locales.map((entry) => entry.code), [
    locales,
  ])
  const collectionSlug = field.admin?.custom?.collectionSlug
  const [
    isLoading,
    setIsLoading,
  ] = useState<boolean>(Boolean(id && collectionSlug))
  const [
    statuses,
    setStatuses,
  ] = useState<Record<string, ReturnType<typeof normalizeTranslationStatus>>>(() => {
    const currentLocale = locale.code

    return Object.fromEntries(locales.map((entry) => [
      entry.code,
      normalizeTranslationStatus(entry.code === currentLocale ? value : undefined),
    ]))
  })

  useEffect(() => {
    setStatuses((currentStatuses) => ({
      ...currentStatuses,
      [locale.code]: normalizeTranslationStatus(value),
    }))
  }, [
    locale.code,
    value,
  ])

  useEffect(() => {
    if (!id || !collectionSlug) {
      setIsLoading(false)

      return
    }

    let cancelled = false

    setIsLoading(true)

    const query = new URLSearchParams({
      depth: '0',
      draft: 'true',
      locale: 'all',
    })

    void fetch(`${config.routes.api ?? '/api'}/${collectionSlug}/${id}?${query.toString()}`)
      .then(async (response) => {
        if (!response.ok) {
          return null
        }

        return response.json() as Promise<Record<string, unknown>>
      })
      .then((document) => {
        if (!document || cancelled) {
          return
        }

        setStatuses(resolveTranslationStatusMap(document[TRANSLATION_STATUS_FIELD_NAME], localeCodes))
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    collectionSlug,
    config.routes.api,
    id,
    lastUpdateTime,
    localeCodes,
  ])

  return (
    <div style={{
      display: 'grid',
      gap: '0.5rem',
    }}
    >
      <div style={{
        color: 'var(--theme-elevation-600)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
      }}
      >
        Translation status
      </div>
      <TranslationStatusBadges
        isLoading={isLoading}
        locales={locales}
        statuses={statuses}
      />
    </div>
  )
}

function getLocales(config: ReturnType<typeof useConfig>['config'], locale: string): LocaleOption[] {
  if (!config.localization) {
    return []
  }

  return config.localization.locales.map((entry) => ({
    code: entry.code,
    label: typeof entry.label === 'string'
      ? entry.label
      : entry.label[locale] ?? entry.code,
  }))
}
