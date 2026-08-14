/* eslint-disable @typescript-eslint/naming-convention */
import type { SortDirection } from '@wisemen/pagination'
import { FilterOperator } from './enums/typesense-filter-options.enum.js'
import { TypesenseOperationMode } from './enums/typesense-operation-mode.enum.js'
import type { TypesenseMissingValues } from './enums/typesense-missing-values.enum.js'
import { TypesenseLogicOperator } from './enums/typesense-logic-operator.enum.js'
import { TypesenseFilterParamsBuilder } from './filter-params.builder.js'
import { TypesenseJoinType } from './enums/typesense-join-type.enum.js'
import type { TypesenseJoinOptions } from './join-params.builder.js'
import { TypesenseJoinParamsBuilder } from './join-params.builder.js'
import type { TypesenseCollection, TypesenseCollectionName } from '../schema/collection.js'
import { getTypesenseCollectionName } from '../schema/collection.js'
import type { InferDocumentType } from '../schema/document.js'
import { TYPESENSE_DEFAULT_OFFSET, TYPESENSE_DEFAULT_LIMIT } from '../typesense.constant.js'
import type {
  CollectionField,
  FilterOperatorForField,
  FilterValueForOperator,
  ReferencedCollection,
  ReferenceField,
  SerializableFilterInputValue
} from './filter.types.js'
import type { ApplyInverseJoin, ApplyReferenceJoin, TypesenseSearchParams } from './search-result.types.js'

type FieldName<TField> =
  TField extends { name: infer TName extends string }
    ? TName
    : string

type SearchFieldConstraint<TField> =
  TField extends { index: true }
    ? unknown
    : {
        readonly __typesenseError__:
          FieldName<TField> extends infer TName extends string
            ? `Field "${TName}" must have index: true to be used in addSearchOn`
            : 'addSearchOn only accepts fields with index: true'
      }

type FilterFieldConstraint<TField> =
  TField extends { index: true }
    ? unknown
    : {
        readonly __typesenseError__:
          FieldName<TField> extends infer TName extends string
            ? `Field "${TName}" must have index: true to be used in addFilterOn`
            : 'addFilterOn only accepts fields with index: true'
      }

type FilterOperatorConstraint<TField> =
  FilterOperatorForField<TField> extends never
    ? {
        readonly __typesenseError__:
          FieldName<TField> extends infer TName extends string
            ? `Field "${TName}" does not support simple filter operators in addFilterOn`
            : 'addFilterOn only accepts fields that support simple filter operators'
      }
    : unknown

type GroupFieldConstraint<TField> =
  TField extends { facet: true }
    ? unknown
    : {
        readonly __typesenseError__:
          FieldName<TField> extends infer TName extends string
            ? `Field "${TName}" must have facet: true to be used in groupBy`
            : 'groupBy only accepts fields with facet: true'
      }

type SortFieldConstraint<TField> =
  TField extends { sort: true }
    ? unknown
    : {
        readonly __typesenseError__:
          FieldName<TField> extends infer TName extends string
            ? `Field "${TName}" must have sort: true to be used in addSortOn`
            : 'addSortOn only accepts fields with sort: true'
      }

type InfixArgumentConstraint<TField> =
  TField extends { infix: true }
    ? TypesenseOperationMode
    : {
        readonly __typesenseError__:
          FieldName<TField> extends infer TName extends string
            ? `Field "${TName}" must have infix: true to use the infix argument in addSearchOn`
            : 'The infix argument in addSearchOn requires a field with infix: true'
      }

type SearchOnArguments<TField> =
  TField extends { infix: true }
    ? [infix?: TypesenseOperationMode]
    : [] | [infix: InfixArgumentConstraint<TField>]

export class TypesenseSearchParamsBuilder<
  TCollection extends TypesenseCollection,
  TResult extends object = InferDocumentType<TCollection>
> {
  private filters: string[] = []
  private queries: string[] = []
  private sorting: string[] = []
  private includeFields: string[] = []
  private groupByFields: string[] = []
  private query: string = '*'
  private offset: number = TYPESENSE_DEFAULT_OFFSET
  private limit: number = TYPESENSE_DEFAULT_LIMIT
  private groupLimit?: number
  private infix: TypesenseOperationMode[] = []

  constructor (
    private collection: TCollection
  ) { }

  withQuery (query: string | undefined): this {
    this.query = query ?? '*'
    return this
  }

  withOffset (offset: number | undefined): this {
    this.offset = offset ?? TYPESENSE_DEFAULT_OFFSET
    return this
  }

  withLimit (limit: number | undefined): this {
    this.limit = limit ?? TYPESENSE_DEFAULT_LIMIT
    return this
  }

  withGroupLimit (groupLimit: number | undefined): this {
    this.groupLimit = groupLimit
    return this
  }

  addSearchOn<TField extends CollectionField<TCollection>> (
    field: TField & SearchFieldConstraint<TField>,
    ...[infix]: SearchOnArguments<TField>
  ): this {
    this.queries.push(field.name)
    this.infix.push((infix as TypesenseOperationMode | undefined) ?? TypesenseOperationMode.OFF)
    return this
  }

  groupBy<TField extends CollectionField<TCollection>> (
    field: TField & GroupFieldConstraint<TField>
  ): this {
    this.groupByFields.push(field.name)
    return this
  }

  addFilterOn<
    TField extends CollectionField<TCollection>,
    TOperator extends FilterOperatorForField<TField>
  > (
    filterField: TField & FilterFieldConstraint<TField> & FilterOperatorConstraint<TField>,
    operator: TOperator,
    values: FilterValueForOperator<TField, TOperator> | undefined,
  ): this {
    if (values !== undefined) {
      this.filters.push(
        `${filterField.name}:${this.getOperator(operator)}${this.serializeFilterValue(values as SerializableFilterInputValue)}`
      )
    }

    return this
  }

  addFilterBrackets (
    callback: (builder: Omit<TypesenseFilterParamsBuilder<TCollection>, 'build'>) => void
  ): this {
    const builder = new TypesenseFilterParamsBuilder<TCollection>()
    callback(builder)
    const filter = builder.build()

    if (filter) {
      this.filters.push(`(${filter})`)
    }

    return this
  }

  addSortOn<TField extends CollectionField<TCollection>> (
    sortField: TField & SortFieldConstraint<TField>,
    direction: SortDirection,
    missingValues?: TypesenseMissingValues
  ): this {
    const field = missingValues != null
      ? `${sortField.name}(missing_values: ${missingValues})`
      : sortField.name

    this.sorting.push(`${field}:${direction}`)
    return this
  }

  innerJoin<
    TField extends ReferenceField<TCollection>,
    TOptions extends TypesenseJoinOptions<ReferencedCollection<TField>> | undefined = undefined
  > (
    field: TField,
    options?: TOptions
  ): TypesenseSearchParamsBuilder<TCollection, ApplyReferenceJoin<TResult, TField, TOptions>> {
    this.addJoin(TypesenseJoinType.INNER, this.getJoinTarget(field), undefined, options)
    return this as unknown as TypesenseSearchParamsBuilder<TCollection, ApplyReferenceJoin<TResult, TField, TOptions>>
  }

  leftJoin<
    TField extends ReferenceField<TCollection>,
    TOptions extends TypesenseJoinOptions<ReferencedCollection<TField>> | undefined = undefined
  > (
    field: TField,
    options?: TOptions
  ): TypesenseSearchParamsBuilder<TCollection, ApplyReferenceJoin<TResult, TField, TOptions, true>> {
    this.addJoin(TypesenseJoinType.LEFT, this.getJoinTarget(field), undefined, options)
    return this as unknown as TypesenseSearchParamsBuilder<TCollection, ApplyReferenceJoin<TResult, TField, TOptions, true>>
  }

  inverseJoin<
    TTarget extends TypesenseCollection,
    TOptions extends TypesenseJoinOptions<TTarget> | undefined = undefined
  > (
    collection: TTarget,
    filterBy: (builder: Omit<TypesenseFilterParamsBuilder<TTarget>, 'build'>) => void,
    options?: TOptions
  ): TypesenseSearchParamsBuilder<TCollection, ApplyInverseJoin<TResult, TCollection, TTarget, TOptions>>
  inverseJoin (
    collectionName: TypesenseCollectionName,
    filterBy: string,
    options?: TypesenseJoinOptions
  ): this

  inverseJoin<
    TTarget extends TypesenseCollection,
    TOptions extends TypesenseJoinOptions<TTarget> | undefined = undefined
  > (
    collectionOrName: TTarget | TypesenseCollectionName,
    filterByOrCallback: string | ((builder: Omit<TypesenseFilterParamsBuilder<TTarget>, 'build'>) => void),
    options?: TOptions
  ): TypesenseSearchParamsBuilder<TCollection, TResult> | TypesenseSearchParamsBuilder<
    TCollection,
    ApplyInverseJoin<TResult, TCollection, TTarget, TOptions>
  > {
    if (typeof collectionOrName === 'string') {
      return this.addJoin(TypesenseJoinType.INVERSE, collectionOrName, filterByOrCallback as string, options)
    }

    const builder = new TypesenseFilterParamsBuilder<TTarget>()
    const callback = filterByOrCallback as (builder: Omit<TypesenseFilterParamsBuilder<TTarget>, 'build'>) => void
    callback(builder)

    this.addJoin(TypesenseJoinType.INVERSE, getTypesenseCollectionName(collectionOrName), builder.build(), options)

    return this as unknown as TypesenseSearchParamsBuilder<
      TCollection,
      ApplyInverseJoin<TResult, TCollection, TTarget, TOptions>
    >
  }

  build (): TypesenseSearchParams<TResult> {
    const groupLimit = this.groupLimit  

    return {
      q: this.query,
      query_by: this.queries.join(','),
      include_fields: this.includeFields.join(','),
      filter_by: this.filters.join(` ${TypesenseLogicOperator.AND} `),
      group_by: this.groupByFields.join(','),
      group_missing_values: false,
      sort_by: this.sorting.join(','),
      offset: this.offset,
      limit: this.limit,
      group_limit: groupLimit,
      infix: this.infix
    } as TypesenseSearchParams<TResult>
  }

  private getOperator (options?: FilterOperator): string {
    return options ?? FilterOperator.EQUALS
  }

  private serializeFilterValue (value: SerializableFilterInputValue): string {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return '[]'
      }

      return value.length > 1 ? `[${value.join(',')}]` : String(value[0])
    }

    return String(value)
  }

  private addJoin<TTarget extends TypesenseCollection = TypesenseCollection> (
    type: TypesenseJoinType,
    field: string,
    filterBy?: string,
    options?: TypesenseJoinOptions<TTarget>
  ): this {
    const builder = new TypesenseJoinParamsBuilder()
    const joinParams = builder.build(type, field, filterBy, options)

    this.includeFields.push(joinParams.fields)

    if (joinParams.filter != undefined) {
      this.filters.push(joinParams.filter)
    }

    return this
  }

  private getJoinTarget<TField extends ReferenceField<TCollection>> (
    field: TField
  ): TypesenseCollectionName<ReferencedCollection<TField>> {
    const referenceField = field as ReferenceField<TCollection>
    const reference = referenceField.reference

    const target = reference == null
      ? undefined
      : getTypesenseCollectionName(reference.collection)

    if (target == null) {
      throw new Error(`Field "${referenceField.name}" must reference another collection to be used in joins`)
    }

    return target as TypesenseCollectionName<ReferencedCollection<TField>>
  }
}

export function createSearchParamsBuilder<TCollection extends TypesenseCollection> (
  collection: TCollection
): TypesenseSearchParamsBuilder<TCollection> {
  return new TypesenseSearchParamsBuilder(collection)
}
