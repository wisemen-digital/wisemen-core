/* eslint-disable e18e/prefer-static-regex */
/* eslint-disable require-await */
import type { Field } from 'payload'

import { t } from '#i18n/index.ts'
import type {
  TranslationAdapter,
  TranslationAdapterArgs,
  TranslationAdapterDefinition,
} from '#types.ts'

export interface GoogleTranslateAdapterOptions {
  apiKey?: string
  apiURL?: string
  fallbackApiURL?: string
}

export const GOOGLE_TRANSLATE_ADAPTER_KEY = 'google'

export const GOOGLE_TRANSLATE_ADAPTER_FIELDS: Field[] = [
  {
    name: 'apiKey',
    label: t('general.api_key'),
    type: 'text',
  },
  {
    name: 'apiURL',
    label: t('general.api_url'),
    type: 'text',
  },
  {
    name: 'fallbackApiURL',
    label: t('general.fallback_api_url'),
    type: 'text',
  },
]

export class GoogleTranslateAdapter implements TranslationAdapter {
  private static readonly longSupportedCloudLocales = new Set([
    'auto',
    'ceb',
    'haw',
    'hmn',
    'zh-TW',
  ])

  private readonly apiKey?: string
  private readonly apiURL: string
  private readonly fallbackApiURL: string

  public constructor({
    apiKey,
    apiURL = 'https://translation.googleapis.com/language/translate/v2',
    fallbackApiURL = 'https://translate.googleapis.com/translate_a/single',
  }: GoogleTranslateAdapterOptions) {
    this.apiKey = typeof apiKey === 'string' && apiKey.trim().length > 0 ? apiKey : undefined
    this.apiURL = typeof apiURL === 'string' && apiURL.trim().length > 0
      ? sanitizeUrlInput(apiURL)
      : 'https://translation.googleapis.com/language/translate/v2'
    this.fallbackApiURL = typeof fallbackApiURL === 'string' && fallbackApiURL.trim().length > 0
      ? sanitizeUrlInput(fallbackApiURL)
      : 'https://translate.googleapis.com/translate_a/single'
  }

  private normalizeLocaleForCloud(locale: string): string {
    if (!locale || GoogleTranslateAdapter.longSupportedCloudLocales.has(locale)) {
      return locale
    }

    return locale.slice(0, 2)
  }

  private async translateWithApiKey({
    document: _document,
    sourceLocale,
    targetLocale,
    text,
  }: Omit<TranslationAdapterArgs, 'req'>): Promise<string> {
    const response = await fetch(`${this.apiURL}?key=${encodeURIComponent(this.apiKey as string)}`, {
      body: JSON.stringify({
        format: 'text',
        q: text,
        source: this.normalizeLocaleForCloud(sourceLocale),
        target: this.normalizeLocaleForCloud(targetLocale),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`Google Translate request failed with status ${response.status}.`)
    }

    const result = await response.json() as {
      data?: {
        translations?: {
          translatedText?: string
        }[]
      }
      error?: {
        message?: string
      }
    }

    const translatedText = result.data?.translations?.[0]?.translatedText

    if (!translatedText) {
      throw new Error(result.error?.message ?? 'Google Translate response did not contain translated text.')
    }

    return translatedText
  }

  private async translateWithoutApiKey({
    document: _document,
    sourceLocale,
    targetLocale,
    text,
  }: Omit<TranslationAdapterArgs, 'req'>): Promise<string> {
    const query = new URLSearchParams({
      client: 'gtx',
      dj: '1',
      dt: 't',
      hl: targetLocale,
      ie: 'UTF-8',
      oe: 'UTF-8',
      q: text,
      sl: sourceLocale || 'auto',
      source: 'icon',
      tl: targetLocale,
    })

    const response = await fetch(`${this.fallbackApiURL}?${query.toString()}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Google Translate request failed with status ${response.status}.`)
    }

    const result = await response.json() as {
      sentences?: {
        trans?: string
      }[]
    }

    const translatedText = result.sentences
      ?.map((sentence) => sentence.trans ?? '')
      .join('')

    if (!translatedText) {
      throw new Error('Google Translate response did not contain translated text.')
    }

    return translatedText
  }

  public async translate({
    document,
    sourceLocale,
    targetLocale,
    text,
  }: TranslationAdapterArgs): Promise<string> {
    if (!text.trim()) {
      return text
    }

    if (this.apiKey) {
      return this.translateWithApiKey({
        document,
        sourceLocale,
        targetLocale,
        text,
      })
    }

    return this.translateWithoutApiKey({
      document,
      sourceLocale,
      targetLocale,
      text,
    })
  }
}

export function createGoogleTranslateAdapter(options: GoogleTranslateAdapterOptions = {}): TranslationAdapter {
  return new GoogleTranslateAdapter(options)
}

function sanitizeUrlInput(url: string): string {
  return url.replace(/\s+/g, '')
}

export const googleTranslateAdapterDefinition: TranslationAdapterDefinition<GoogleTranslateAdapterOptions> = {
  create: (options) => createGoogleTranslateAdapter(options),
  fields: GOOGLE_TRANSLATE_ADAPTER_FIELDS,
  key: GOOGLE_TRANSLATE_ADAPTER_KEY,
  label: t('general.google_translate'),
}
