'use client'
/* eslint-disable unicorn/no-await-expression-member */
/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
import {
  ConfirmationModal,
  SelectInput,
  toast,
  useModal,
} from '@payloadcms/ui'
import { useState } from 'react'

import { t } from '#i18n/index.ts'
import type { TranslationMode } from '#status.ts'
import {
  TRANSLATION_MODE_LABELS,
  TRANSLATION_MODES,
} from '#status.ts'

interface TranslateMenuItemsClientProps {
  adapterDefinitions: {
    key: string
    label: string
  }[]
  currentLocale: string
  documentID: number | string
  endpointPath: string
  locales: {
    code: string
    label: string
  }[]
}

const ALL_LOCALES_VALUE = 'all'
const TRANSLATION_ERROR_MESSAGE = 'Something went wrong with translating, check your settings and if it persists contact an admin.'

export function TranslateMenuItemsClient({
  adapterDefinitions,
  currentLocale,
  documentID,
  endpointPath,
  locales,
}: TranslateMenuItemsClientProps) {
  const {
    openModal,
  } = useModal()
  const [
    pendingLocale,
    setPendingLocale,
  ] = useState<string | null>(null)
  const targetLocales = locales.filter((locale) => locale.code !== currentLocale)
  const localeOptions = [
    {
      label: t('general.all_locales'),
      value: ALL_LOCALES_VALUE,
    },
    ...targetLocales.map((locale) => ({
      label: locale.label,
      value: locale.code,
    })),
  ]
  const [
    selectedLocale,
    setSelectedLocale,
  ] = useState<string>(localeOptions[0]?.value ?? '')
  const [
    selectedMode,
    setSelectedMode,
  ] = useState<TranslationMode>(TRANSLATION_MODES.translate)
  const [
    selectedAdapterKey,
    setSelectedAdapterKey,
  ] = useState<string>(adapterDefinitions[0]?.key ?? '')
  const modalSlug = `translate-locale-${documentID}`

  if (targetLocales.length === 0) {
    return null
  }

  const hasMultipleAdapters = adapterDefinitions.length > 1
  const adapterOptions = adapterDefinitions.map((adapter) => ({
    label: adapter.label,
    value: adapter.key,
  }))
  const selectedAdapterLabel = adapterDefinitions.find((adapter) => adapter.key === selectedAdapterKey)?.label
    ?? adapterDefinitions[0]?.label
    ?? 'selected adapter'

  const selectedTargetLocale = targetLocales.find((locale) => locale.code === selectedLocale) ?? null
  const selectedLocaleLabel = selectedLocale === ALL_LOCALES_VALUE
    ? 'all locales'
    : selectedTargetLocale?.label ?? targetLocales[0]?.label ?? 'selected locale'
  const pendingLocaleLabel = pendingLocale === ALL_LOCALES_VALUE
    ? 'all locales'
    : targetLocales.find((locale) => locale.code === pendingLocale)?.label ?? pendingLocale
  const modeOptions = [
    {
      label: TRANSLATION_MODE_LABELS[TRANSLATION_MODES.translate],
      value: TRANSLATION_MODES.translate,
    },
    {
      label: TRANSLATION_MODE_LABELS[TRANSLATION_MODES.retranslate],
      value: TRANSLATION_MODES.retranslate,
    },
  ]
  const selectedModeLabel = TRANSLATION_MODE_LABELS[selectedMode]

  return (
    <div>
      <button
        className={`popup-button-list__button${pendingLocale ? ' popup-button-list__disabled' : ''}`}
        disabled={Boolean(pendingLocale)}
        onClick={() => {
          setSelectedLocale((currentValue) => {
            if (currentValue === ALL_LOCALES_VALUE || targetLocales.some((locale) => locale.code === currentValue)) {
              return currentValue
            }

            return localeOptions[0]?.value ?? ''
          })
          openModal(modalSlug)
        }}
        type="button"
      >
        {pendingLocale
          ? `Translating to ${pendingLocaleLabel}...`
          : 'Translate to...'}
      </button>

      <ConfirmationModal
        body={(
          <div style={{
            display: 'grid',
            gap: '1rem',
          }}
          >
            <div style={{
              display: 'grid',
              gap: '0.5rem',
            }}
            >
              <p style={{
                color: 'var(--theme-elevation-600)',
                fontSize: '0.875rem',
                margin: 0,
              }}
              >
                Select the locale to translate this document into, or choose all locales except the current one.
              </p>

              {hasMultipleAdapters
                ? (
                    <div>
                      <SelectInput
                        id={`${modalSlug}-adapter`}
                        isClearable={false}
                        label="Translation service"
                        name={`${modalSlug}-adapter`}
                        onChange={(option) => {
                          if (!Array.isArray(option) && option?.value && typeof option.value === 'string') {
                            setSelectedAdapterKey(option.value)
                          }
                        }}
                        options={adapterOptions}
                        path={`${modalSlug}-adapter`}
                        required={true}
                        value={selectedAdapterKey}
                      />
                    </div>
                  )
                : null}

              <div>
                <SelectInput
                  id={`${modalSlug}-select`}
                  isClearable={false}
                  label="Target locale"
                  name={`${modalSlug}-locale`}
                  onChange={(option) => {
                    if (!Array.isArray(option) && option?.value && typeof option.value === 'string') {
                      setSelectedLocale(option.value)
                    }
                  }}
                  options={localeOptions}
                  path={`${modalSlug}-locale`}
                  required={true}
                  value={selectedLocale}
                />
              </div>

              <div>
                <SelectInput
                  id={`${modalSlug}-mode`}
                  isClearable={false}
                  label="Mode"
                  name={`${modalSlug}-mode`}
                  onChange={(option) => {
                    if (!Array.isArray(option) && option?.value && typeof option.value === 'string') {
                      setSelectedMode(option.value as TranslationMode)
                    }
                  }}
                  options={modeOptions}
                  path={`${modalSlug}-mode`}
                  required={true}
                  value={selectedMode}
                />
              </div>
            </div>
            <div style={{
              alignItems: 'center',
              display: 'flex',
              gap: '0.5rem',
            }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: 'var(--theme-text)',
                  display: 'inline-flex',
                  flexShrink: 0,
                }}
              >
                <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" fill="currentColor" fillOpacity="0.14" r="6.5" stroke="currentColor" />
                  <path d="M8 4.75V8.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                  <circle cx="8" cy="10.8" fill="currentColor" r="0.85" />
                </svg>
              </span>
              <p style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                margin: 0,
              }}
              >
                {hasMultipleAdapters ? `Using ${selectedAdapterLabel}. ` : null}
                {selectedMode === TRANSLATION_MODES.translate
                  ? 'Translate updates stale and not translated locales'
                  : 'Retranslate replaces every locale, including manually edited ones'}
              </p>
            </div>

          </div>
        )}
        confirmLabel={pendingLocale
          ? `Translating to ${selectedLocaleLabel}...`
          : `Translate to ${selectedLocaleLabel}`}
        confirmingLabel={`Translating to ${selectedLocaleLabel}...`}
        heading="Translate document"
        modalSlug={modalSlug}
        onConfirm={async () => {
          setPendingLocale(selectedLocale)

          try {
            const translationPromise = (async () => {
              const response = await fetch(endpointPath, {
                body: JSON.stringify({
                  adapterKey: hasMultipleAdapters ? selectedAdapterKey : undefined,
                  documentID,
                  mode: selectedMode,
                  sourceLocale: currentLocale,
                  targetLocale: selectedLocale,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
              })

              if (!response.ok) {
                const errorMessage = await readErrorMessage(response)

                throw new Error(errorMessage)
              }

              return response.json() as Promise<{
                skippedLocales?: string[]
                translatedLocales?: string[]
              }>
            })()

            toast.promise(translationPromise, {
              error: () => TRANSLATION_ERROR_MESSAGE,
              loading: `${selectedModeLabel} ${selectedLocaleLabel}...`,
              success: (result) => {
                if ((result.translatedLocales?.length ?? 0) === 0) {
                  return `No locales needed ${selectedModeLabel.toLowerCase()}.`
                }

                return `${selectedModeLabel} ${selectedLocaleLabel} completed.`
              },
            })

            let translatedLocales: string[] = []

            try {
              translatedLocales = (await translationPromise).translatedLocales ?? []
            }
            catch {
              return
            }

            if (selectedLocale !== ALL_LOCALES_VALUE && translatedLocales[0]) {
              const url = new URL(window.location.href)

              url.searchParams.set('locale', translatedLocales[0])
              window.location.assign(url.toString())

              return
            }

            if (translatedLocales.length > 0) {
              window.location.reload()
            }
          }
          finally {
            setPendingLocale(null)
          }
        }}
      />
    </div>
  )
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json() as {
      error?: string
      message?: string
    }

    return body.error ?? body.message ?? `Translation request failed with status ${response.status}.`
  }
  catch {
    return `Translation request failed with status ${response.status}.`
  }
}
