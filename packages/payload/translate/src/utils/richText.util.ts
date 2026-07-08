/* eslint-disable e18e/prefer-static-regex */
import type { RichTextTranslationOptions } from '#types.ts'

export interface RichTextTranslationRules {
  metaKeys: Set<string>
  optionKeyPatterns: RegExp[]
  skipKeys: Set<string>
}

const RICH_TEXT_META_KEYS = new Set([
  'blockName',
  'blockType',
  'detail',
  'direction',
  'fields',
  'format',
  'id',
  'indent',
  'mode',
  'relationTo',
  'style',
  'type',
  'url',
  'value',
  'version',
])

const RICH_TEXT_SKIP_KEYS = new Set([
  'backgroundImage',
  'icon',
  'image',
  'panelVariant',
  'startPanel',
  'variant',
])

const RICH_TEXT_OPTION_KEY_PATTERNS = [
  /appearance$/i,
  /formType$/i,
  /layout$/i,
  /mode$/i,
  /position$/i,
  /size$/i,
  /source$/i,
  /theme$/i,
  /type$/i,
  /variant$/i,
]

export function createRichTextTranslationRules(options?: RichTextTranslationOptions): RichTextTranslationRules {
  return {
    metaKeys: new Set([
      ...RICH_TEXT_META_KEYS,
      ...(options?.metaKeys ?? []),
    ]),
    optionKeyPatterns: [
      ...RICH_TEXT_OPTION_KEY_PATTERNS,
      ...(options?.optionKeyPatterns ?? []).map((pattern) => typeof pattern === 'string' ? new RegExp(pattern) : pattern),
    ],
    skipKeys: new Set([
      ...RICH_TEXT_SKIP_KEYS,
      ...(options?.skipKeys ?? []),
    ]),
  }
}

export function shouldTranslateRichTextString(
  key: string,
  value: string,
  rules: RichTextTranslationRules,
): boolean {
  if (!value.trim()) {
    return false
  }

  if (rules.metaKeys.has(key) || rules.skipKeys.has(key)) {
    return false
  }

  if (rules.optionKeyPatterns.some((pattern) => pattern.test(key))) {
    return false
  }

  if (looksLikeURL(value)) {
    return false
  }

  return true
}

function looksLikeURL(value: string): boolean {
  return /^https?:\/\//i.test(value)
}
