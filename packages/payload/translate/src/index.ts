/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
export {
  createDeepLTranslateAdapter,
  createGoogleTranslateAdapter,
  DEEPL_TRANSLATE_ADAPTER_FIELDS,
  DEEPL_TRANSLATE_ADAPTER_KEY,
  deeplTranslateAdapterDefinition,
  googleTranslateAdapterDefinition,
} from '#adapters/index.ts'
export { payloadTranslatePlugin } from '#plugin.ts'
export {
  createTranslationSettingsCollection,
  createTranslationSettingsField,
  createTranslationSettingsGlobal,
} from '#settings/index.ts'

export function defineTranslatableCollection<
  TDocument extends object,
  TSlug extends string = string,
>(definition: {
  ignoredFields?: readonly import('#types.ts').DeepFieldPath<TDocument>[]
  slug: TSlug
  translatableFields: readonly import('#types.ts').DeepFieldPath<TDocument>[]
}) {
  return definition
}

export type {
  DeepFieldPath,
  RichTextTranslationOptions,
  TranslatableCollectionDefinition,
  TranslationAdapter,
  TranslationAdapterDefinition,
  TranslationPluginOptions,
} from '#types.ts'
