import type { Field } from 'payload'

import { t } from '#i18n/index.ts'
import type {
  TranslationAdapter,
  TranslationAdapterArgs,
  TranslationAdapterDefinition,
} from '#types.ts'

export interface DeepLTranslateAdapterOptions {
  apiKey?: string
  apiURL?: string
}

export const DEEPL_TRANSLATE_ADAPTER_KEY = 'deepl'

const MAX_CONCURRENT_DEEPL_REQUESTS = 3
const INITIAL_REQUEST_INTERVAL_MS = 500
const MAX_RETRY_ATTEMPTS = 8
const INITIAL_RETRY_DELAY_MS = 1000
const MAX_RETRY_DELAY_MS = 30_000
const MAX_REQUEST_BODY_SIZE_BYTES = 127 * 1024
const DEEPL_REQUEST_THROTTLES = new Map<string, DeepLRequestThrottle>()

interface PendingRequest {
  args: TranslationAdapterArgs
  reject: (reason?: unknown) => void
  resolve: (value: string) => void
}

export const DEEPL_TRANSLATE_ADAPTER_FIELDS: Field[] = [
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
]

export class DeepLTranslateAdapter implements TranslationAdapter {
  private activeRequests = 0
  private readonly apiKey?: string
  private readonly apiURL: string
  private readonly pendingRequests: PendingRequest[] = []
  private processingScheduled = false

  private readonly requestThrottle: DeepLRequestThrottle

  public constructor({
    apiKey, apiURL = 'https://api.deepl.com/v2/translate',
  }: DeepLTranslateAdapterOptions) {
    this.apiKey = typeof apiKey === 'string' && apiKey.trim().length > 0 ? apiKey : undefined
    this.apiURL = typeof apiURL === 'string' && apiURL.trim().length > 0
      ? sanitizeUrlInput(apiURL)
      : 'https://api.deepl.com/v2/translate'
    this.requestThrottle = getRequestThrottle(this.apiKey, this.apiURL)
  }

  private processPendingRequests(): void {
    while (this.activeRequests < MAX_CONCURRENT_DEEPL_REQUESTS && this.pendingRequests.length > 0) {
      const pendingRequests = this.takeNextBatch()

      if (pendingRequests.length === 0) {
        return
      }

      this.activeRequests += 1
      void this.translateRequest(pendingRequests.map((pendingRequest) => pendingRequest.args))
        .then((translations) => {
          for (const [
            index,
            pendingRequest,
          ] of pendingRequests.entries()) {
            pendingRequest.resolve(translations[index] as string)
          }
        }, (error: unknown) => {
          for (const pendingRequest of pendingRequests) {
            pendingRequest.reject(error)
          }
        })
        .finally(() => {
          this.activeRequests -= 1
          this.processPendingRequests()
        })
    }
  }

  private schedulePendingRequests(): void {
    if (this.processingScheduled) {
      return
    }

    this.processingScheduled = true
    queueMicrotask(() => {
      this.processingScheduled = false
      this.processPendingRequests()
    })
  }

  private takeNextBatch(): PendingRequest[] {
    const firstRequest = this.pendingRequests.shift()

    if (!firstRequest) {
      return []
    }

    const pendingRequests = [
      firstRequest,
    ]
    const sourceLocale = firstRequest.args.sourceLocale
    const targetLocale = firstRequest.args.targetLocale

    while (this.pendingRequests.length > 0) {
      const nextRequest = this.pendingRequests[0]

      if (!nextRequest || nextRequest.args.sourceLocale !== sourceLocale || nextRequest.args.targetLocale !== targetLocale) {
        break
      }

      const requestBody = createRequestBody(sourceLocale, targetLocale, [
        ...pendingRequests.map((pendingRequest) => pendingRequest.args.text),
        nextRequest.args.text,
      ])

      if (getByteLength(requestBody) > MAX_REQUEST_BODY_SIZE_BYTES) {
        break
      }

      pendingRequests.push(nextRequest)
      this.pendingRequests.shift()
    }

    return pendingRequests
  }

  private async translateRequest(requests: TranslationAdapterArgs[]): Promise<string[]> {
    const [
      firstRequest,
    ] = requests

    if (!firstRequest) {
      throw new Error('DeepL Translate request did not contain text.')
    }

    const requestBody = createRequestBody(
      firstRequest.sourceLocale,
      firstRequest.targetLocale,
      requests.map((request) => request.text),
    )

    for (let attempt = 0; attempt <= MAX_RETRY_ATTEMPTS; attempt += 1) {
      await this.requestThrottle.waitForRequestSlot()

      const response = await fetch(this.apiURL, {
        body: requestBody,
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json() as {
          translations?: {
            text?: string
          }[]
        }

        if (result.translations?.length !== requests.length || result.translations.some((translation) => !translation.text)) {
          throw new Error('DeepL Translate response did not contain translated text.')
        }

        return result.translations.map((translation) => translation.text as string)
      }

      if ((response.status === 429 || response.status === 500) && attempt < MAX_RETRY_ATTEMPTS) {
        const retryDelay = getRetryDelay(response.headers.get('retry-after'), attempt)

        this.requestThrottle.increaseRequestInterval(retryDelay)
        await wait(retryDelay)

        continue
      }

      const errorBody = await response.text().catch(() => '')
      const errorDetails = errorBody ? `: ${errorBody}` : ''

      const attempts = attempt + 1

      throw new Error(`DeepL Translate request failed with status ${response.status} after ${attempts} attempt${attempts === 1 ? '' : 's'}${errorDetails}.`)
    }

    throw new Error('DeepL Translate request failed after retrying.')
  }

  public translate(args: TranslationAdapterArgs): Promise<string> {
    if (!args.text.trim()) {
      return Promise.resolve(args.text)
    }

    return new Promise((resolve, reject) => {
      this.pendingRequests.push({
        args,
        reject,
        resolve,
      })

      this.schedulePendingRequests()
    })
  }
}

class DeepLRequestThrottle {
  private nextRequestAt = 0
  private previousRequestSlot: Promise<void> = Promise.resolve()
  private requestIntervalMs = INITIAL_REQUEST_INTERVAL_MS

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

function getRequestThrottle(apiKey: string | undefined, apiURL: string): DeepLRequestThrottle {
  const throttleKey = `${apiURL}:${apiKey ?? ''}`
  const existingThrottle = DEEPL_REQUEST_THROTTLES.get(throttleKey)

  if (existingThrottle) {
    return existingThrottle
  }

  const throttle = new DeepLRequestThrottle()

  DEEPL_REQUEST_THROTTLES.set(throttleKey, throttle)

  return throttle
}

function createRequestBody(sourceLocale: string, targetLocale: string, text: string[]): string {
  return JSON.stringify({
    source_lang: sourceLocale ? normalizeLocale(sourceLocale) : undefined,
    target_lang: normalizeLocale(targetLocale),
    text,
  })
}

function getByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength
}

function normalizeLocale(locale: string): string {
  return locale
    .replaceAll('_', '-')
    .toUpperCase()
}

function sanitizeUrlInput(url: string): string {
  return url.replace(/\s+/g, '')
}

function getRetryDelay(retryAfter: string | null, attempt: number): number {
  const retryAfterSeconds = Number(retryAfter)

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
    return retryAfterSeconds * 1000
  }

  return Math.min(INITIAL_RETRY_DELAY_MS * 2 ** attempt, MAX_RETRY_DELAY_MS)
}

function wait(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

export function createDeepLTranslateAdapter(options: DeepLTranslateAdapterOptions = {}): TranslationAdapter {
  return new DeepLTranslateAdapter(options)
}

export const deeplTranslateAdapterDefinition: TranslationAdapterDefinition<DeepLTranslateAdapterOptions> = {
  create: (options) => createDeepLTranslateAdapter(options),
  fields: DEEPL_TRANSLATE_ADAPTER_FIELDS,
  key: DEEPL_TRANSLATE_ADAPTER_KEY,
  label: t('general.deep_l'),
}
