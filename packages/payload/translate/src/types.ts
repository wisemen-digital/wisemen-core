import type {
  Field,
  PayloadRequest,
  StaticLabel,
} from 'payload'

export type Primitive = boolean | number | string | null | undefined

type Join<Prefix extends string, Key extends string> = Prefix extends '' ? Key : `${Prefix}.${Key}`

type IsPlainObject<T> = T extends Array<any> | Date | Primitive ? false : T extends object ? true : false

export type DeepFieldPath<T, Prefix extends string = ''> = T extends object
  ? {
      [Key in Extract<keyof T, string>]: IsPlainObject<NonNullable<T[Key]>> extends true
        ? DeepFieldPath<NonNullable<T[Key]>, Join<Prefix, Key>> | Join<Prefix, Key>
        : Join<Prefix, Key>
    }[Extract<keyof T, string>]
  : never

export interface TranslationAdapterArgs {
  document: Record<string, unknown>
  req: PayloadRequest
  sourceLocale: string
  targetLocale: string
  text: string
}

export interface TranslationAdapter {
  translate: (args: TranslationAdapterArgs) => Promise<string>
}

export interface TranslationAccessArgs {
  collectionSlug?: string
  document?: Record<string, unknown>
  req: PayloadRequest
  translations?: TranslationPluginOptions['translations']
}

export type TranslationAccess = (args: TranslationAccessArgs) => boolean | Promise<boolean>

export interface TranslationAdapterDefinition<TOptions extends object = Record<string, unknown>> {
  create: (options: TOptions) => TranslationAdapter
  defaultOptions?: Partial<TOptions>
  fields?: Field[]
  key: string
  label: StaticLabel
}

export interface RichTextTranslationOptions {
  metaKeys?: readonly string[]
  optionKeyPatterns?: readonly (string | RegExp)[]
  skipKeys?: readonly string[]
}

export interface TranslatableCollectionDefinition<
  TDocument extends object,
  TSlug extends string = string,
> {
  ignoredFields?: readonly DeepFieldPath<TDocument>[]
  slug: TSlug
  translatableFields: readonly DeepFieldPath<TDocument>[]
}

export interface TranslationPluginOptions {
  [key: string]: unknown
  access?: TranslationAccess
  adapters: readonly TranslationAdapterDefinition[]
  collections: readonly TranslatableCollectionDefinition<Record<string, unknown>, string>[]
  endpointPath?: string
  richText?: RichTextTranslationOptions
  translations?: {
    documentID?: number | string
    slug: string
    type: 'collection' | 'global'
  }
}

export interface ResolvedFieldSelection {
  dataPath: string[]
  field: Field
  selector: string
}
