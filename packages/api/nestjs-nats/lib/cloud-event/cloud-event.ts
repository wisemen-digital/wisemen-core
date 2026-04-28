import { IsDateString, IsDefined, IsNotEmpty, IsString } from 'class-validator'

/**
 * Represents an event following the CloudEvents spec.
 * @see https://cloudevents.io/
 */
export class CloudEvent {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsDateString({ strict: true })
  time: string

  @IsString()
  @IsNotEmpty()
  datacontenttype: string

  @IsString()
  @IsNotEmpty()
  source: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsString()
  @IsNotEmpty()
  specversion: string

  @IsDefined()
  data: unknown
}
