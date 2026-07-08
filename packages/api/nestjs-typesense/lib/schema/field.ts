import type { CollectionFieldSchema, FieldType } from 'typesense/lib/Typesense/Collection.js'

export type TypesenseFieldType = FieldType
export type TypesenseQueryByFieldType = Extract<FieldType, 'string' | 'string[]' | 'string*'>

export interface TypesenseFieldFlags {
  readonly optional: boolean
  readonly index: boolean
  readonly sort: boolean
  readonly facet: boolean
  readonly infix: boolean
}

export type TypesenseFieldValueFromType<TType extends TypesenseFieldType> =
  TType extends 'string' | 'string*' | 'image' ? string
    : TType extends 'string[]' ? string[]
      : TType extends 'bool' ? boolean
        : TType extends 'bool[]' ? boolean[]
          : TType extends 'int32' | 'int64' | 'float' ? number
            : TType extends 'int32[]' | 'int64[]' | 'float[]' ? number[]
              : TType extends 'geopoint' ? [number, number]
                : TType extends 'geopoint[]' | 'geopolygon' ? [number, number][]
                  : TType extends 'object' ? Record<string, unknown>
                    : TType extends 'object[]' ? Record<string, unknown>[]
                      : unknown

export type TypesenseCollectionFieldSchema<TType extends TypesenseFieldType = TypesenseFieldType> = Omit<
CollectionFieldSchema,
'name' | 'type'
> & {
  readonly name: string
  readonly type: TType
}

export const typesenseFieldConfig = Symbol.for('wisemen.typesense.field.config')

type DefaultTypesenseFieldFlags = {
  readonly optional: false
  readonly index: true
  readonly sort: false
  readonly facet: false
  readonly infix: false
}

type SetFlag<
  TFlags extends TypesenseFieldFlags,
  TKey extends keyof TypesenseFieldFlags,
  TValue extends boolean
> = Omit<TFlags, TKey> & Record<TKey, TValue>

const defaultTypesenseFieldFlags: DefaultTypesenseFieldFlags = {
  optional: false,
  index: true,
  sort: false,
  facet: false,
  infix: false
}

interface TypesenseFieldConfigMetadata<
  TName extends string,
  TType extends TypesenseFieldType,
  TValue,
  TFlags extends TypesenseFieldFlags
> {
  readonly name: TName
  readonly type: TType
  readonly value: TValue
  readonly flags: TFlags
}

export interface TypesenseField<
  TName extends string = string,
  TType extends TypesenseFieldType = TypesenseFieldType,
  TValue = unknown,
  TFlags extends TypesenseFieldFlags = TypesenseFieldFlags
> extends TypesenseCollectionFieldSchema<TType> {
  readonly name: TName
  readonly optional: TFlags['optional']
  readonly index: TFlags['index']
  readonly sort: TFlags['sort']
  readonly facet: TFlags['facet']
  readonly infix: TFlags['infix']
  readonly [typesenseFieldConfig]: TypesenseFieldConfigMetadata<TName, TType, TValue, TFlags>
}

export type AnyTypesenseField = TypesenseField<string, TypesenseFieldType, unknown, TypesenseFieldFlags>

export type TypesenseFieldValue<TField extends AnyTypesenseField> = TField[typeof typesenseFieldConfig]['value']
export type TypesenseFieldName<TField extends AnyTypesenseField> = TField[typeof typesenseFieldConfig]['name']
export type TypesenseFieldFlagsFor<TField extends AnyTypesenseField> = TField[typeof typesenseFieldConfig]['flags']
export type TypesenseFieldTypeFor<TField extends AnyTypesenseField> = TField[typeof typesenseFieldConfig]['type']

export class TypesenseFieldBuilder<
  TType extends TypesenseFieldType,
  TValue,
  TFlags extends TypesenseFieldFlags = DefaultTypesenseFieldFlags
> {
  constructor (
    private readonly fieldType: TType,
    private readonly flags: TypesenseFieldFlags = defaultTypesenseFieldFlags
  ) {}

  optional (): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'optional', true>> {
    return new TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'optional', true>>(
      this.fieldType,
      {
        ...this.flags,
        optional: true
      }
    )
  }

  index (): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'index', true>>
  index<TEnabled extends boolean> (
    enabled: TEnabled
  ): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'index', TEnabled>>
  index (enabled: boolean = true): TypesenseFieldBuilder<TType, TValue, TypesenseFieldFlags> {
    return new TypesenseFieldBuilder(this.fieldType, {
      ...this.flags,
      index: enabled
    })
  }

  sort (): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'sort', true>> {
    return new TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'sort', true>>(
      this.fieldType,
      {
        ...this.flags,
        sort: true
      }
    )
  }

  facet (): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'facet', true>> {
    return new TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'facet', true>>(
      this.fieldType,
      {
        ...this.flags,
        facet: true
      }
    )
  }

  infix (
    this: TypesenseFieldBuilder<TypesenseQueryByFieldType, TValue, TFlags>
  ): TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'infix', true>> {
    return new TypesenseFieldBuilder<TType, TValue, SetFlag<TFlags, 'infix', true>>(
      this.fieldType as TType,
      {
        ...this.flags,
        infix: true
      }
    )
  }

  build<TName extends string> (name: TName): TypesenseField<TName, TType, TValue, TFlags> {
    return Object.freeze({
      name,
      type: this.fieldType,
      optional: this.flags.optional as TFlags['optional'],
      index: this.flags.index as TFlags['index'],
      sort: this.flags.sort as TFlags['sort'],
      facet: this.flags.facet as TFlags['facet'],
      infix: this.flags.infix as TFlags['infix'],
      [typesenseFieldConfig]: {
        name,
        type: this.fieldType,
        value: undefined as TValue,
        flags: {
          optional: this.flags.optional as TFlags['optional'],
          index: this.flags.index as TFlags['index'],
          sort: this.flags.sort as TFlags['sort'],
          facet: this.flags.facet as TFlags['facet'],
          infix: this.flags.infix as TFlags['infix']
        } as TFlags
      }
    }) as TypesenseField<TName, TType, TValue, TFlags>
  }
}

export type AnyTypesenseFieldBuilder = TypesenseFieldBuilder<TypesenseFieldType, unknown, TypesenseFieldFlags>

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
