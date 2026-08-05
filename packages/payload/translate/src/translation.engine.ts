/* eslint-disable require-await */

import type {
  Block,
  Field,
  PayloadRequest,
  Tab,
  TabsField,
} from 'payload'

import type {
  ResolvedFieldSelection,
  RichTextTranslationOptions,
  TranslationAdapter,
} from '#types.ts'
import {
  createRichTextTranslationRules,
  findUniqueFieldByName,
  getValueAtPath,
  isPlainObject,
  resolveFieldByPath,
  setValueAtPath,
  shouldTranslateRichTextString,
} from '#utils/index.ts'

interface TranslateDocumentArgs {
  adapter: TranslationAdapter
  req: PayloadRequest
  richText?: RichTextTranslationOptions
  selections: ResolvedFieldSelection[]
  sourceDocument: Record<string, unknown>
  sourceLocale: string
  targetLocale: string
}

interface TranslationContext {
  adapter: TranslationAdapter
  document: Record<string, unknown>
  memo: Map<string, Promise<string>>
  req: PayloadRequest
  richText: ReturnType<typeof createRichTextTranslationRules>
  sourceLocale: string
  targetLocale: string
}

export async function translateDocumentFields({
  adapter,
  req,
  richText,
  selections,
  sourceDocument,
  sourceLocale,
  targetLocale,
}: TranslateDocumentArgs): Promise<Record<string, unknown>> {
  const context: TranslationContext = {
    adapter,
    document: sourceDocument,
    memo: new Map(),
    req,
    richText: createRichTextTranslationRules(richText),
    sourceLocale,
    targetLocale,
  }

  const translatedDocument: Record<string, unknown> = {}

  for (const selection of selections) {
    const currentValue = getValueAtPath(sourceDocument, selection.dataPath)
    const translatedValue = await translateValueByField(selection.field, currentValue, context)

    setValueAtPath(translatedDocument, selection.dataPath, translatedValue)
  }

  return translatedDocument
}

export function resolveFieldSelections(fields: Field[], selectors: readonly string[]): ResolvedFieldSelection[] {
  return selectors.map((selector) => {
    const resolved = selector.includes('.')
      ? resolveFieldByPath(fields, selector.split('.'))
      : findUniqueFieldByName(fields, selector)

    if (!resolved) {
      throw new Error(`Unable to resolve translatable field selector "${selector}".`)
    }

    return {
      ...resolved,
      selector,
    }
  })
}

async function translateValueByField(field: Field, value: unknown, context: TranslationContext): Promise<unknown> {
  switch (field.type) {
    case 'array': {
      if (!Array.isArray(value)) {
        return value
      }

      return sanitizeArrayRows(
        await Promise.all(value.map((row) => translateFieldsObject(field.fields, row, context))),
      )
    }

    case 'blocks': {
      if (!Array.isArray(value)) {
        return value
      }

      return sanitizeArrayRows(
        await Promise.all(value.map((row) => translateBlockRow(field.blocks, row, context))),
      )
    }

    case 'collapsible':
    case 'group':
      return translateFieldsObject(field.fields, value, context)

    case 'richText':
      return translateRichTextValue(value, context)

    case 'row':
      return translateFieldsObject(field.fields, value, context)

    case 'tabs':
      return translateTabsValue(field, value, context)

    case 'text':
    case 'textarea':
      return typeof value === 'string' ? translateString(value, context) : value

    default:
      return value
  }
}

async function translateFieldsObject(fields: Field[], value: unknown, context: TranslationContext): Promise<unknown> {
  if (!isPlainObject(value)) {
    return value
  }

  const translated = {
    ...value,
  }

  for (const field of fields) {
    if ('name' in field && typeof field.name === 'string') {
      translated[field.name] = await translateValueByField(field, translated[field.name], context)

      continue
    }

    if (field.type === 'row') {
      Object.assign(translated, await translateFieldsObject(field.fields, translated, context))

      continue
    }

    if (field.type === 'tabs') {
      Object.assign(translated, await translateTabsValue(field, translated, context) as Record<string, unknown>)
    }
  }

  return translated
}

async function translateBlockRow(blocks: Block[], value: unknown, context: TranslationContext): Promise<unknown> {
  if (!isPlainObject(value) || typeof value.blockType !== 'string') {
    return value
  }

  const matchingBlock = blocks.find((block) => block.slug === value.blockType)

  if (!matchingBlock) {
    return value
  }

  return translateFieldsObject(matchingBlock.fields, value, context)
}

async function translateTabsValue(field: TabsField, value: unknown, context: TranslationContext): Promise<unknown> {
  if (!isPlainObject(value)) {
    return value
  }

  let translated = {
    ...value,
  }

  for (const tab of field.tabs) {
    translated = await translateTabValue(tab, translated, context)
  }

  return translated
}

async function translateTabValue(tab: Tab, value: Record<string, unknown>, context: TranslationContext):
Promise<Record<string, unknown>> {
  if ('name' in tab && typeof tab.name === 'string') {
    return {
      ...value,
      [tab.name]: await translateFieldsObject(tab.fields, value[tab.name], context),
    }
  }

  return translateFieldsObject(tab.fields, value, context) as Promise<Record<string, unknown>>
}

async function translateRichTextValue(value: unknown, context: TranslationContext): Promise<unknown> {
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => translateRichTextValue(item, context)))
  }

  if (!isPlainObject(value)) {
    return value
  }

  const translatedEntries = await Promise.all(Object.entries(value).map(async ([
    key,
    childValue,
  ]) => {
    if (typeof childValue === 'string' && shouldTranslateRichTextString(key, childValue, context.richText)) {
      return [
        key,
        await translateString(childValue, context),
      ] as const
    }

    return [
      key,
      await translateRichTextValue(childValue, context),
    ] as const
  }))

  return Object.fromEntries(translatedEntries)
}

async function translateString(value: string, context: TranslationContext): Promise<string> {
  const cacheKey = `${context.sourceLocale}:${context.targetLocale}:${value}`
  const cached = context.memo.get(cacheKey)

  if (cached) {
    return cached
  }

  const translationPromise = context.adapter.translate({
    document: context.document,
    req: context.req,
    sourceLocale: context.sourceLocale,
    targetLocale: context.targetLocale,
    text: value,
  })

  context.memo.set(cacheKey, translationPromise)

  return translationPromise
}

function sanitizeArrayRows(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeArrayRows(item))
  }

  if (!isPlainObject(value)) {
    return value
  }

  const sanitized = {
    ...value,
  } as Record<string, unknown>

  delete sanitized.id

  for (const [
    key,
    childValue,
  ] of Object.entries(sanitized)) {
    if (Array.isArray(childValue) || isPlainObject(childValue)) {
      sanitized[key] = sanitizeArrayRows(childValue)
    }
  }

  return sanitized
}
