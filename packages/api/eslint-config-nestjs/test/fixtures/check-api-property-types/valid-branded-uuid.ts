import { ApiProperty } from './support/api-property.js'
import type { ExampleUuid } from './support/example.uuid.js'

export class ExampleQuery {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid!: ExampleUuid
}
