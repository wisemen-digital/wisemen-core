/* eslint-disable @typescript-eslint/naming-convention */
import type { TypesenseCollection } from '../schema/collection.js'
import { FilterOperator } from './enums/typesense-filter-options.enum.js'
import { TypesenseLogicOperator } from './enums/typesense-logic-operator.enum.js'
import type {
  CollectionField,
  FilterOperatorForField,
  FilterValueForOperator,
  SerializableFilterInputValue
} from './filter.types.js'

interface TypesenseFilter {
  filter: string
  operator: TypesenseLogicOperator
}

type FieldName<TField> =
  TField extends { name: infer TName extends string }
    ? TName
    : string

type FilterFieldConstraint<TField> =
  TField extends { index: true }
    ? unknown
    : {
        readonly __typesenseError__:
          FieldName<TField> extends infer TName extends string
            ? `Field "${TName}" must have index: true to be used in where`
            : 'where only accepts fields with index: true'
      }

type FilterOperatorConstraint<TField> =
  FilterOperatorForField<TField> extends never
    ? {
        readonly __typesenseError__:
          FieldName<TField> extends infer TName extends string
            ? `Field "${TName}" does not support simple filter operators in where`
            : 'where only accepts fields that support simple filter operators'
      }
    : unknown

type FilterFieldOrCallBack<Collection extends TypesenseCollection> = CollectionField<Collection>
  | ((builder: TypesenseFilterParamsBuilder<Collection>) => void)

export class TypesenseFilterParamsBuilder<Collection extends TypesenseCollection> {
  private filters: TypesenseFilter[] = []
  private operator: TypesenseLogicOperator

  constructor (operator: TypesenseLogicOperator = TypesenseLogicOperator.AND) {
    this.operator = operator
  }

  where<TField extends CollectionField<Collection>> (
    filterField: TField & FilterFieldConstraint<TField> & FilterOperatorConstraint<TField>,
    operator: FilterOperator.EQUALS,
    values: FilterValueForOperator<TField, FilterOperator.EQUALS> | undefined
  ): this
  where<
    TField extends CollectionField<Collection>,
    TOperator extends Exclude<FilterOperatorForField<TField>, FilterOperator.EQUALS>
  > (
    filterField: TField & FilterFieldConstraint<TField> & FilterOperatorConstraint<TField>,
    operator: TOperator,
    values: FilterValueForOperator<TField, TOperator> | undefined
  ): this
  where (builderCallback: (builder: TypesenseFilterParamsBuilder<Collection>) => void): this
  where (
    filterFieldOrCallback: FilterFieldOrCallBack<Collection>,
    operator?: FilterOperator,
    values?: SerializableFilterInputValue
  ): this {
    if (typeof filterFieldOrCallback === 'function') {
      return this.filterByField(filterFieldOrCallback)
    } else {
      return this.filterByField(filterFieldOrCallback, values, operator)
    }
  }

  andWhere<TField extends CollectionField<Collection>> (
    filterField: TField & FilterFieldConstraint<TField> & FilterOperatorConstraint<TField>,
    operator: FilterOperator.EQUALS,
    values: FilterValueForOperator<TField, FilterOperator.EQUALS> | undefined
  ): this
  andWhere<
    TField extends CollectionField<Collection>,
    TOperator extends Exclude<FilterOperatorForField<TField>, FilterOperator.EQUALS>
  > (
    filterField: TField & FilterFieldConstraint<TField> & FilterOperatorConstraint<TField>,
    operator: TOperator,
    values: FilterValueForOperator<TField, TOperator> | undefined
  ): this
  andWhere (builderCallback: (builder: TypesenseFilterParamsBuilder<Collection>) => void): this
  andWhere (
    filterFieldOrCallback: FilterFieldOrCallBack<Collection>,
    operator?: FilterOperator,
    values?: SerializableFilterInputValue
  ): this {
    this.and()

    if (typeof filterFieldOrCallback === 'function') {
      return this.where(filterFieldOrCallback)
    } else {
      return this.filterByField(filterFieldOrCallback, values, operator)
    }
  }

  orWhere<TField extends CollectionField<Collection>> (
    filterField: TField & FilterFieldConstraint<TField> & FilterOperatorConstraint<TField>,
    operator: FilterOperator.EQUALS,
    values: FilterValueForOperator<TField, FilterOperator.EQUALS> | undefined
  ): this
  orWhere<
    TField extends CollectionField<Collection>,
    TOperator extends Exclude<FilterOperatorForField<TField>, FilterOperator.EQUALS>
  > (
    filterField: TField & FilterFieldConstraint<TField> & FilterOperatorConstraint<TField>,
    operator: TOperator,
    values: FilterValueForOperator<TField, TOperator> | undefined
  ): this
  orWhere (builderCallback: (builder: TypesenseFilterParamsBuilder<Collection>) => void): this
  orWhere (
    filterFieldOrCallback: FilterFieldOrCallBack<Collection>,
    operator?: FilterOperator,
    values?: SerializableFilterInputValue
  ): this {
    this.or()

    if (typeof filterFieldOrCallback === 'function') {
      return this.where(filterFieldOrCallback)
    } else {
      return this.filterByField(filterFieldOrCallback, values, operator)
    }
  }

  build (): string {
    if (this.filters.length === 0) return ''

    return this.filters
      .map((filter, index) => (index === 0 ? filter.filter : `${filter.operator} ${filter.filter}`))
      .join(' ')
  }

  private and (): this {
    this.operator = TypesenseLogicOperator.AND
    return this
  }

  private or (): this {
    this.operator = TypesenseLogicOperator.OR
    return this
  }

  private filterByField (
    filterField: CollectionField<Collection>,
    values: SerializableFilterInputValue | undefined,
    options?: FilterOperator
  ): this
  private filterByField (
    builderCallback: (builder: TypesenseFilterParamsBuilder<Collection>) => void
  ): this
  private filterByField (
    filterFieldOrCallback: FilterFieldOrCallBack<Collection>,
    values?: SerializableFilterInputValue,
    options?: FilterOperator
  ): this {
    if (typeof filterFieldOrCallback === 'function') {
      const builder = new TypesenseFilterParamsBuilder<Collection>()

      filterFieldOrCallback(builder)
      this.filters.push({
        filter: `(${builder.build()})`,
        operator: this.operator
      })
    } else {
      if (values !== undefined) {
        this.filters.push({
          filter: `${filterFieldOrCallback.name}:${this.getOperator(options)}${this.serializeFilterValue(values)}`,
          operator: this.operator
        })
      }
    }

    return this
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
}
