import { ApiProperty } from './support/api-property.js'
import type { ExampleUuid } from './support/example.uuid.js'

export class ExampleQuery {
  @ApiProperty()
  uuid!: ExampleUuid
}
