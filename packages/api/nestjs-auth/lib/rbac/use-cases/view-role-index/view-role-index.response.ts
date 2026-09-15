import { ApiProperty } from '@nestjs/swagger'
import type { Type } from '@nestjs/common'

export function createViewRoleIndexResponse<TResponse> (response: Type<TResponse>): Type<{ items: TResponse[] }> {
  class ViewRoleIndexResponse {
    @ApiProperty({ type: response, isArray: true })
    items: TResponse[]

    constructor (items: TResponse[]) {
      this.items = items
    }
  }

  return ViewRoleIndexResponse
}
