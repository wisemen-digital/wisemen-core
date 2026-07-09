// oxlint-disable typescript/no-explicit-any
import type { TypesenseCollection, TypesenseCollectionFields } from '../schema/collection.js'
import type { TypesenseField, TypesenseFieldReference, TypesenseFieldType } from '../schema/field.js'
import { FilterOperator } from './enums/typesense-filter-options.enum.js'

export type CollectionField<TCollection extends TypesenseCollection> =
  TypesenseCollectionFields<TCollection>[keyof TypesenseCollectionFields<TCollection>]

export type SortField<TCollection extends TypesenseCollection> =
  Extract<CollectionField<TCollection>, { sort: true }>['name']

export type ReferenceField<TCollection extends TypesenseCollection> =
  Extract<CollectionField<TCollection>, { reference: TypesenseFieldReference }>

export type ReferencedField<TField> =
  TField extends { reference: infer TReference extends TypesenseFieldReference }
    ? TReference
    : never

export type ReferencedCollection<TField> =
  ReferencedField<TField> extends TypesenseFieldReference<string, any, any, infer TCollection>
    ? TCollection
    : never

type FieldTypeOf<TField> =
  TField extends TypesenseField<string, infer TType>
    ? TType
    : never

type FieldValueOf<TField> =
  TField extends TypesenseField<string, TypesenseFieldType, infer TValue>
    ? TValue
    : never

type FilterScalarValue<TValue> =
  TValue extends readonly (infer TItem)[]
    ? TItem
    : TValue extends (infer TItem)[]
      ? TItem
      : TValue

type StringLikeFieldType = 'string' | 'string*' | 'string[]' | 'image'
type NumericFieldType = 'int32' | 'int64' | 'float' | 'int32[]' | 'int64[]' | 'float[]'
type BooleanFieldType = 'bool' | 'bool[]'

export type EqualityFilterOperator =
  | FilterOperator.EQUALS
  | FilterOperator.NOT_EQUALS

export type StringFilterOperator =
  | EqualityFilterOperator
  | FilterOperator.NON_EXACT
  | FilterOperator.NOT_CONTAINS

export type NumericFilterOperator =
  | EqualityFilterOperator
  | FilterOperator.GREATER_THAN
  | FilterOperator.GREATER_THAN_OR_EQUALS
  | FilterOperator.LESS_THAN
  | FilterOperator.LESS_THAN_OR_EQUALS

export type FilterOperatorForField<TField> =
  FieldTypeOf<TField> extends StringLikeFieldType
    ? StringFilterOperator
    : FieldTypeOf<TField> extends NumericFieldType
      ? NumericFilterOperator
      : FieldTypeOf<TField> extends BooleanFieldType
        ? EqualityFilterOperator
        : never

export type SupportedFilterField<TCollection extends TypesenseCollection> =
  CollectionField<TCollection> extends infer TField
    ? TField extends { index: true }
      ? FilterOperatorForField<TField> extends never
        ? never
        : TField
      : never
    : never

type EqualityFilterValue<TField> =
  FilterScalarValue<FieldValueOf<TField>>
  | Array<FilterScalarValue<FieldValueOf<TField>>>

export type FilterValueForOperator<
  TField,
  TOperator extends FilterOperator
> =
  TOperator extends EqualityFilterOperator
    ? EqualityFilterValue<TField>
    : TOperator extends NumericFilterOperator
      ? FilterScalarValue<FieldValueOf<TField>>
      : TOperator extends StringFilterOperator
        ? EqualityFilterValue<TField>
        : never

export type SerializableFilterValue = string | number | boolean
export type SerializableFilterInputValue =
  | SerializableFilterValue
  | SerializableFilterValue[]
