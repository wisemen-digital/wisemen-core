import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger'

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export function SortDirectionApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: SortDirection,
    enumName: 'SortDirection'
  })
}

export abstract class SortQuery {
  abstract key: unknown
  abstract order: SortDirection
}

// oxlint-disable-next-line typescript/no-empty-object-type
export interface FilterQuery {

}

export abstract class SearchQuery {
  abstract sort?: SortQuery[]
  abstract filter?: FilterQuery
  abstract search?: string
}
