import { ApiProperty } from './support/api-property.js'

export class ExampleQuery {
  @ApiProperty({ nullable: true, required: false, isArray: true })
  filters?: string[] | null
}
