// oxlint-disable typescript/no-explicit-any
/* eslint-disable @typescript-eslint/naming-convention */
import type { CollectionFieldSchema, FieldType } from 'typesense/lib/Typesense/Collection.js'
import type { TypesenseCollection } from './collection.js'

export type TypesenseFieldType = FieldType
export type TypesenseQueryByFieldType = Extract<FieldType, 'string' | 'string[]' | 'string*'>
export const typesenseFieldConfig = Symbol.for('wisemen.typesense.field.config')

export interface TypesenseFieldReference<
  TName extends string = string,
  TType extends TypesenseFieldType = TypesenseFieldType,
  TValue = unknown,
  TCollection extends TypesenseCollection = TypesenseCollection
> {
  readonly name: TName
  readonly type: TType
  collection: TCollection
  readonly [typesenseFieldConfig]?: TValue
}

export interface TypesenseFieldFlags<TReferenceField extends TypesenseFieldReference | undefined = undefined> {
  optional: boolean
  index: boolean
  sort: boolean
  facet: boolean
  infix: boolean
  reference: TReferenceField
}

export type TypesenseGeoPoint = [number, number]

interface TypesenseTypeMap {
  'string': string
  'string*': string
  'image': string
  'string[]': string[]
  'bool': boolean
  'bool[]': boolean[]
  'int32': number
  'int64': number
  'float': number
  'int32[]': number[]
  'int64[]': number[]
  'float[]': number[]
  'geopoint': TypesenseGeoPoint
  'geopoint[]': TypesenseGeoPoint[]
  'geopolygon': TypesenseGeoPoint[]
  'object': Record<string, unknown>
  'object[]': Record<string, unknown>[]
}

export type TypesenseFieldValueFromType<TType extends TypesenseFieldType> =
  TType extends keyof TypesenseTypeMap ? TypesenseTypeMap[TType] : unknown

export type TypesenseCollectionFieldSchema<TType extends TypesenseFieldType = TypesenseFieldType> =
  Omit<CollectionFieldSchema, 'name' | 'type'> & {
    readonly name: string
    readonly type: TType
  }

type DefaultTypesenseFieldFlags = {
  readonly optional: false
  readonly index: true
  readonly sort: false
  readonly facet: false
  readonly infix: false
  readonly reference: undefined
}

type SetFlag<
  TFlags extends TypesenseFieldFlags<TypesenseFieldReference | undefined>,
  TKey extends keyof TFlags,
  TValue
> = Omit<TFlags, TKey> & Record<TKey, TValue>

type FieldValue<TField extends TypesenseFieldReference> =
  TField extends TypesenseFieldReference<any, any, infer TValue, any>
    ? TValue
    : never

function defaultFlags (): DefaultTypesenseFieldFlags {
  return {
    optional: false,
    index: true,
    sort: false,
    facet: false,
    infix: false,
    reference: undefined
  }
}

export interface TypesenseField<
  TName extends string = string,
  TType extends TypesenseFieldType = TypesenseFieldType,
  // oxlint-disable-next-line no-unused-vars
  TValue = unknown,
  TFlags extends TypesenseFieldFlags<TypesenseFieldReference | undefined> = TypesenseFieldFlags<TypesenseFieldReference | undefined>,
  TCollection extends TypesenseCollection = TypesenseCollection
> extends TypesenseCollectionFieldSchema<TType>, TypesenseFieldReference<TName, TType, TValue, TCollection> {
  name: TName
  optional: TFlags['optional']
  index: TFlags['index']
  sort: TFlags['sort']
  facet: TFlags['facet']
  infix: TFlags['infix']
  reference: TFlags['reference']
  collection: TCollection
}

export class TypesenseFieldBuilder<
  TType extends TypesenseFieldType = TypesenseFieldType,
  TValue = unknown,
  TFlags extends TypesenseFieldFlags<TypesenseFieldReference | undefined> = DefaultTypesenseFieldFlags
> {
  constructor (
    private fieldType: TType,
    private flags: TypesenseFieldFlags<TypesenseFieldReference | undefined> = defaultFlags()
  ) { }

  optional (): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'optional', true>> {
    this.flags.optional = true
    return this as TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'optional', true>>
  }

  /** Index is set to true by default */
  index (): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'index', true>>
  index<TEnabled extends boolean> (
    enabled: TEnabled
  ): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'index', TEnabled>>
  index (enabled: boolean = true): TypesenseFieldBuilder<TType, TValue, TypesenseFieldFlags<TypesenseFieldReference | undefined>> {
    this.flags.index = enabled
    return this
  }

  sort (): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'sort', true>> {
    this.flags.sort = true
    return this as TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'sort', true>>
  }

  facet (): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'facet', true>> {
    this.flags.facet = true
    return this as TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'facet', true>>
  }

  infix (): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'infix', true>> {
    this.flags.infix = true
    return this as TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'infix', true>>
  }

  reference<
    TReferenceCollection extends TypesenseCollection,
    TReferenceField extends TypesenseFieldReference<string, TType, any, TReferenceCollection>
  > (
    field: TReferenceField
  ): TypesenseFieldBuilder<TType, FieldValue<TReferenceField>, SetFlag<TFlags, 'reference', TReferenceField>> {
    this.flags.reference = field
    return this as unknown as TypesenseFieldBuilder<TType, FieldValue<TReferenceField>, SetFlag<TFlags, 'reference', TReferenceField>>
  }

  brand<Brand extends TValue> (): TypesenseFieldBuilder<TType, Brand, TFlags> {
    return this as unknown as TypesenseFieldBuilder<TType, Brand, TFlags>
  }

  build<TPropertyName extends string, TCollection extends TypesenseCollection> (
    propertyName: TPropertyName,
    collection: TCollection
  ): TypesenseField<TPropertyName, TType, TValue, TFlags, TCollection> {

    return Object.freeze({
      name: propertyName,
      type: this.fieldType,
      index: this.flags.index,
      sort: this.flags.sort,
      facet: this.flags.facet,
      infix: this.flags.infix,
      optional: this.flags.optional,
      reference: this.flags.reference,
      collection
    }) as TypesenseField<TPropertyName, TType, TValue, TFlags, TCollection>
  }
}

export type AnyTypesenseFieldBuilder =
  TypesenseFieldBuilder<TypesenseFieldType, unknown, TypesenseFieldFlags<TypesenseFieldReference | undefined>>

function createFieldBuilder<TType extends TypesenseFieldType> (
  fieldType: TType
): TypesenseFieldBuilder<TType, TypesenseFieldValueFromType<TType>> {
  return new TypesenseFieldBuilder<TType, TypesenseFieldValueFromType<TType>>(fieldType)
}

export function string (): TypesenseFieldBuilder<'string', string> {
  return createFieldBuilder('string')
}

export function stringArray (): TypesenseFieldBuilder<'string[]', string[]> {
  return createFieldBuilder('string[]')
}

export function stringStar (): TypesenseFieldBuilder<'string*', string> {
  return createFieldBuilder('string*')
}

export function bool (): TypesenseFieldBuilder<'bool', boolean> {
  return createFieldBuilder('bool')
}

export function boolArray (): TypesenseFieldBuilder<'bool[]', boolean[]> {
  return createFieldBuilder('bool[]')
}

export function int32 (): TypesenseFieldBuilder<'int32', number> {
  return createFieldBuilder('int32')
}

export function int32Array (): TypesenseFieldBuilder<'int32[]', number[]> {
  return createFieldBuilder('int32[]')
}

export function int64 (): TypesenseFieldBuilder<'int64', number> {
  return createFieldBuilder('int64')
}

export function int64Array (): TypesenseFieldBuilder<'int64[]', number[]> {
  return createFieldBuilder('int64[]')
}

export function float (): TypesenseFieldBuilder<'float', number> {
  return createFieldBuilder('float')
}

export function floatArray (): TypesenseFieldBuilder<'float[]', number[]> {
  return createFieldBuilder('float[]')
}

export function geopoint (): TypesenseFieldBuilder<'geopoint', [number, number]> {
  return createFieldBuilder('geopoint')
}

export function geopointArray (): TypesenseFieldBuilder<'geopoint[]', [number, number][]> {
  return createFieldBuilder('geopoint[]')
}

export function geopolygon (): TypesenseFieldBuilder<'geopolygon', [number, number][]> {
  return createFieldBuilder('geopolygon')
}

export function object (): TypesenseFieldBuilder<'object', Record<string, unknown>> {
  return createFieldBuilder('object')
}

export function objectArray (): TypesenseFieldBuilder<'object[]', Record<string, unknown>[]> {
  return createFieldBuilder('object[]')
}

export function auto (): TypesenseFieldBuilder<'auto', unknown> {
  return createFieldBuilder('auto')
}

export function image (): TypesenseFieldBuilder<'image', string> {
  return createFieldBuilder('image')
}

export const TypesenseFieldBuilders = {
  string,
  stringArray,
  stringStar,
  bool,
  boolArray,
  int32,
  int32Array,
  int64,
  int64Array,
  float,
  floatArray,
  geopoint,
  geopointArray,
  geopolygon,
  object,
  objectArray,
  auto,
  image
}
