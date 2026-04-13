import { ApiProperty } from '@nestjs/swagger'

export class ErrorSource {
  @ApiProperty()
  pointer: string
}

export class JsonApiErrorContent {
  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: String, required: false })
  detail?: string

  @ApiProperty({ type: String, required: false })
  title?: string

  @ApiProperty({ type: String, required: false })
  id?: string

  @ApiProperty({ type: String, required: false })
  status?: string

  @ApiProperty({ type: ErrorSource, required: false })
  source?: ErrorSource

  @ApiProperty({ required: false })
  meta?: unknown
}

export class JsonApiError extends Error {
  @ApiProperty({ type: Number })
  status: number

  @ApiProperty({ type: JsonApiErrorContent, isArray: true })
  errors: JsonApiErrorContent[]

  constructor (status: number, errors: JsonApiErrorContent[]) {
    super()
    this.status = status
    this.errors = errors
  }
}
