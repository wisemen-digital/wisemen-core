/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
/* eslint-disable func-style */
'use client'

import { useConfig } from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'
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

export const TranslationStatusCell: React.FC<DefaultCellComponentProps> = ({
  cellData,
  collectionSlug,
  rowData,
}) => {
  const {
    config,
  } = useConfig()
  const locales = useMemo(() => getLocales(config), [
    config,
  ])
  const localeCodes = useMemo(() => locales.map((locale) => locale.code), [
    locales,
  ])
  const defaultLocale = config.localization && typeof config.localization === 'object'
    ? config.localization.defaultLocale
    : undefined
  const [
    isLoading,
    setIsLoading,
  ] = useState<boolean>(Boolean(rowData?.id))
  const [
    statuses,
    setStatuses,
  ] = useState<Record<string, ReturnType<typeof normalizeTranslationStatus>>>(() => {
    return Object.fromEntries(locales.map((locale) => [
      locale.code,
      locale.code === defaultLocale
        ? normalizeTranslationStatus(cellData)
        : normalizeTranslationStatus(null),
    ]))
  })

  useEffect(() => {
    if (!rowData?.id) {
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

    void fetch(`${config.routes.api ?? '/api'}/${collectionSlug}/${rowData.id}?${query.toString()}`)
      .then((response) => {
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
    localeCodes,
    rowData?.id,
  ])

  if (locales.length === 0) {
    return null
  }

  return (
    <TranslationStatusBadges
      isLoading={isLoading}
      locales={locales}
      statuses={statuses}
    />
  )
}

function getLocales(config: ReturnType<typeof useConfig>['config']): LocaleOption[] {
  if (!config.localization) {
    return []
  }

  return config.localization.locales.map((entry) => ({
    code: entry.code,
    label: typeof entry.label === 'string' ? entry.label : entry.code,
  }))
}
