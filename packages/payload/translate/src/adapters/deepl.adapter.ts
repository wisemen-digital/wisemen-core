/* eslint-disable e18e/prefer-static-regex */
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
  private readonly apiKey?: string
  private readonly apiURL: string

  public constructor({
    apiKey, apiURL = 'https://api.deepl.com/v2/translate',
  }: DeepLTranslateAdapterOptions) {
    this.apiKey = typeof apiKey === 'string' && apiKey.trim().length > 0 ? apiKey : undefined
    this.apiURL = typeof apiURL === 'string' && apiURL.trim().length > 0
      ? sanitizeUrlInput(apiURL)
      : 'https://api.deepl.com/v2/translate'
  }

  private normalizeLocale(locale: string): string {
    return locale
      .replaceAll('_', '-')
      .split('-')
      .map((segment, index) => index === 0 ? segment.toUpperCase() : segment.toUpperCase())
      .join('-')
  }

  public async translate({
    sourceLocale,
    targetLocale,
    text,
  }: TranslationAdapterArgs): Promise<string> {
    if (!text.trim()) {
      return text
    }

    const response = await fetch(this.apiURL, {
      body: JSON.stringify({
        source_lang: sourceLocale ? this.normalizeLocale(sourceLocale) : undefined,
        target_lang: this.normalizeLocale(targetLocale),
        text: [
          text,
        ],
      }),
      headers: {
        'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`DeepL Translate request failed with status ${response.status}.`)
    }

    const result = await response.json() as {
      translations?: {
        text?: string
      }[]
    }

    const translatedText = result.translations?.[0]?.text

    if (!translatedText) {
      throw new Error('DeepL Translate response did not contain translated text.')
    }

    return translatedText
  }
}

function sanitizeUrlInput(url: string): string {
  return url.replace(/\s+/g, '')
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
