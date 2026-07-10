import { TypesenseJoinStrategy } from './enums/typesense-join-strategy.enum.js'
import { TypesenseJoinType } from './enums/typesense-join-type.enum.js'
import type { TypesenseCollection } from '../schema/collection.js'
import type { CollectionField } from './filter.types.js'

function exhaustiveCheck (value: never): never {
  throw new Error(`Unhandled join type: ${String(value)}`)
}

export interface TypesenseJoinParams {
  fields: string
  filter?: string
}

export interface TypesenseJoinOptions<TTarget extends TypesenseCollection = TypesenseCollection> {
  strategy?: TypesenseJoinStrategy
  select?: Array<CollectionField<TTarget>>
  alias?: string
}

export class TypesenseJoinParamsBuilder {
  build<TTarget extends TypesenseCollection = TypesenseCollection> (
    type: TypesenseJoinType,
    target: string,
    filterBy?: string,
    options?: TypesenseJoinOptions<TTarget>
  ): TypesenseJoinParams {
    const joinStrategy = options?.strategy ?? TypesenseJoinStrategy.NEST

    const fields = this.buildFields(target, options?.select, options?.alias, joinStrategy)
    const filter = this.buildFilter(type, target, filterBy)

    return {
      fields,
      filter
    }
  }

  private buildFilter (
    type: TypesenseJoinType,
    target: string,
    filterBy?: string
  ): string | undefined {
    switch (type) {
      case TypesenseJoinType.INNER:
        return `$${target}(id: *)`
      case TypesenseJoinType.LEFT:
        return `(id:* || $${target}(id: *))`
      case TypesenseJoinType.INVERSE:
        if (filterBy != null) {
          return `$${target}(${filterBy})`
        } else {
          throw new Error(`Filter by is required for ${type} join type. Please provide a filterBy parameter`)
        }
      default:
        exhaustiveCheck(type)
    }
  }

  private buildFields (
    target: string,
    select?: Array<{ name: string }>,
    alias?: string,
    strategy: TypesenseJoinStrategy = TypesenseJoinStrategy.NEST
  ): string {
    const fields = select?.map(field => field.name).join(',') ?? '*'
    const outputAlias = alias ?? target

    return `$${target}(${fields}, strategy: ${strategy}) as ${outputAlias}`
  }
}
