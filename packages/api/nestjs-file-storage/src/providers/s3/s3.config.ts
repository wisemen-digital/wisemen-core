import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class S3Config {
  @IsBoolean()
  @IsOptional()
  forcePathStyle?: boolean = true

  @IsString()
  @IsNotEmpty()
  accessKeyId: string

  @IsString()
  @IsNotEmpty()
  secretAccessKey: string

  @IsString()
  @IsNotEmpty()
  region: string

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  endpoint: string

  @IsString()
  @IsNotEmpty()
  bucketName: string
}
