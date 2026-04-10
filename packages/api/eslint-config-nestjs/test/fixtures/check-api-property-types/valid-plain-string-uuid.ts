import { ApiProperty } from './support/api-property.js'

export class ExampleQuery {
  @ApiProperty({ format: 'uuid' })
  uuid!: string
}
