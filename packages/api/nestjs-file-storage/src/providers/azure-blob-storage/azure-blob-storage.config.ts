import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class AzureBlobStorageConfig {
  @IsString()
  @IsNotEmpty()
  accountName: string

  @IsString()
  @IsNotEmpty()
  accountKey: string

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  endpoint: string

  @IsString()
  @IsNotEmpty()
  containerName: string
}
