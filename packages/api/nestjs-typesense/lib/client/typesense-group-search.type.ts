import { PaginatedOffsetResponseMeta } from '@wisemen/pagination'
import { ApiProperty } from '@nestjs/swagger'

export class TypesenseGroupResponseMeta extends PaginatedOffsetResponseMeta {
  @ApiProperty({ type: Number })
  totalItems: number

  constructor (totalGroups: number, totalItems: number, offset: number, limit: number) {
    super(totalGroups, offset, limit)
    this.totalItems = totalItems
  }
}

export class TypesenseGroupHit<TDocument extends object> {
  groupKeys: string[]
  total: number
  items: TDocument[]
}

export interface TypesenseGroupSearchResult<TDocument extends object> {
  groups: TypesenseGroupHit<TDocument>[]
  meta: TypesenseGroupResponseMeta
}
