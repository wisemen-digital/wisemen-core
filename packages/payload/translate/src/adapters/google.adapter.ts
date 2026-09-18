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

// The endpoint used without an API key is intended for the Google Translate
// website, not server-to-server use. Keep requests deliberately conservative:
// translating rich text otherwise creates a burst of concurrent requests.
const INITIAL_FALLBACK_REQUEST_INTERVAL_MS = 250
const INITIAL_FALLBACK_RETRY_DELAY_MS = 2000
const MAX_FALLBACK_RETRY_ATTEMPTS = 4
const MAX_FALLBACK_RETRY_DELAY_MS = 30_000
const GOOGLE_FALLBACK_REQUEST_THROTTLES = new Map<string, GoogleFallbackRequestThrottle>()

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
  private readonly fallbackRequestThrottle: GoogleFallbackRequestThrottle

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
    this.fallbackRequestThrottle = getGoogleFallbackRequestThrottle(this.fallbackApiURL)
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

    for (let attempt = 0; attempt <= MAX_FALLBACK_RETRY_ATTEMPTS; attempt += 1) {
      await this.fallbackRequestThrottle.waitForRequestSlot()

      const response = await fetch(`${this.fallbackApiURL}?${query.toString()}`, {
        method: 'GET',
      })

      if (response.ok) {
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

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_FALLBACK_RETRY_ATTEMPTS) {
        const retryDelay = getRetryDelay(response.headers.get('retry-after'), attempt)

        this.fallbackRequestThrottle.increaseRequestInterval(retryDelay)
        await wait(retryDelay)

        continue
      }

      const errorBody = await response.text().catch(() => '')
      const errorDetails = errorBody ? `: ${errorBody}` : ''
      const attempts = attempt + 1

      throw new Error(`Google Translate request failed with status ${response.status} after ${attempts} attempt${attempts === 1 ? '' : 's'}${errorDetails}.`)
    }

    throw new Error('Google Translate request failed after retrying.')
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

class GoogleFallbackRequestThrottle {
  private nextRequestAt = 0
  private previousRequestSlot: Promise<void> = Promise.resolve()
  private requestIntervalMs = INITIAL_FALLBACK_REQUEST_INTERVAL_MS

  public increaseRequestInterval(interval: number): void {
    this.requestIntervalMs = Math.max(this.requestIntervalMs, interval)
  }

  public async waitForRequestSlot(): Promise<void> {
    const previousRequestSlot = this.previousRequestSlot
    let releaseRequestSlot: () => void

    this.previousRequestSlot = new Promise((resolve) => {
      releaseRequestSlot = resolve
    })

    await previousRequestSlot

    const delay = Math.max(this.nextRequestAt - Date.now(), 0)

    if (delay > 0) {
      await wait(delay)
    }

    this.nextRequestAt = Date.now() + this.requestIntervalMs
    releaseRequestSlot!()
  }
}

function getGoogleFallbackRequestThrottle(apiURL: string): GoogleFallbackRequestThrottle {
  const existingThrottle = GOOGLE_FALLBACK_REQUEST_THROTTLES.get(apiURL)

  if (existingThrottle) {
    return existingThrottle
  }

  const throttle = new GoogleFallbackRequestThrottle()

  GOOGLE_FALLBACK_REQUEST_THROTTLES.set(apiURL, throttle)

  return throttle
}

function getRetryDelay(retryAfter: string | null, attempt: number): number {
  const retryAfterSeconds = Number(retryAfter)

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
    return retryAfterSeconds * 1000
  }

  return Math.min(INITIAL_FALLBACK_RETRY_DELAY_MS * 2 ** attempt, MAX_FALLBACK_RETRY_DELAY_MS)
}

function wait(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

export const googleTranslateAdapterDefinition: TranslationAdapterDefinition<GoogleTranslateAdapterOptions> = {
  create: (options) => createGoogleTranslateAdapter(options),
  fields: GOOGLE_TRANSLATE_ADAPTER_FIELDS,
  key: GOOGLE_TRANSLATE_ADAPTER_KEY,
  label: t('general.google_translate'),
}
