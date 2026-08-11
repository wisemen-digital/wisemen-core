import { ApiProperty } from '@nestjs/swagger'

export class GetApiInfoResponse {
  @ApiProperty({ type: String, example: 'development' })
  environment: string

  @ApiProperty({ type: String, description: 'Commit SHA of the current build' })
  commit: string

  @ApiProperty({ type: String, description: 'Version of the current build' })
  version: string

  @ApiProperty({ type: String, format: 'date-time', description: 'Timestamp of the current build' })
  timestamp: string

  constructor (
    environment: string,
    commit: string,
    version: string,
    timestamp: string
  ) {
    this.environment = environment
    this.commit = commit
    this.version = version
    this.timestamp = timestamp
  }
}
