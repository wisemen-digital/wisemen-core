/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
export {
  createGoogleTranslateAdapter,
  googleTranslateAdapterDefinition,
} from '#adapters/index.ts'
export { payloadTranslatePlugin } from '#plugin.ts'

export function defineTranslatableCollection<
  TDocument extends object,
  TSlug extends string = string,
>(definition: {
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
