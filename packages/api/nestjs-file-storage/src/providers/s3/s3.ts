import { Readable } from 'stream'
import { Injectable } from '@nestjs/common'
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { validateSync } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { S3Config } from '#src/providers/s3/s3.config.js'
import { S3_DOWNLOAD_URL_EXPIRES_S, S3_UPLOAD_EXPIRES_MS, S3_UPLOAD_URL_EXPIRES_S } from '#src/providers/s3/s3.constants.js'
import { FileIndex, FileStorage } from '#src/providers/file-storage-provider.js'

@Injectable()
export class S3 extends FileStorage {
  private readonly _client: S3Client

  constructor (
    private readonly _config: S3Config
  ) {
    super()

    this.validateConfig(_config)

    this._client = new S3Client({
      forcePathStyle: this._config.forcePathStyle,
      region: this._config.region,
      endpoint: this._config.endpoint,
      credentials: {
        accessKeyId: this._config.accessKeyId,
        secretAccessKey: this._config.secretAccessKey
      }
    })
  }

  private get client (): S3Client {
    return this._client
  }

  private get bucketName (): string {
    return this._config.bucketName
  }

  private validateConfig (config: S3Config): void {
    const validationDto = plainToClass(
      S3Config,
      config,
      { enableImplicitConversion: true }
    )
    const errors = validateSync(validationDto, { skipMissingProperties: false, whitelist: true })

    if (errors.length > 0) {
      throw new Error(errors.toString())
    }
  }

  validateKey (key: string): void {
    // Reference: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html

    // Regex Breakdown:
    // ✅ Allowed chars: A-Z a-z 0-9 ! - _ . * ' ( ) /
    // ✅ Length: 1..1024 characters (note: not bytes, regex can’t measure UTF-8 bytes)
    // ❌ Rejects keys starting with ./
    // ❌ Rejects any path segment exactly . or ..

    // eslint-disable-next-line no-useless-escape
    const regex = /^(?!\.\/)(?!\.{1,2}$)(?!.*(?:^|\/)\.{1,2}(?:\/|$))[A-Za-z0-9!\-_.\*'()\/]{1,1024}$/

    if (!regex.test(key)) {
      throw new Error(`Invalid S3 key: ${key}`)
    }
  }

  public async createTemporaryUploadUrl (
    key: string,
    mimeType: string,
    expiresInSeconds?: number,
    isPublic?: boolean
  ): Promise<string> {
    this.validateKey(key)

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
      ACL: isPublic === undefined ? 'public-read' : 'private'
    })

    return await getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds ?? S3_UPLOAD_URL_EXPIRES_S
    })
  }

  public createTemporaryPreviewUrl (
    key: string,
    mimeType?: string,
    expiresInSeconds?: number
  ): Promise<string> {
    this.validateKey(key)

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ResponseContentType: mimeType,
      ResponseContentDisposition: 'inline'
    })

    return getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds ?? S3_DOWNLOAD_URL_EXPIRES_S
    })
  }

  public createTemporaryDownloadUrl (
    key: string,
    name: string,
    mimeType: string,
    expiresInSeconds?: number
  ): Promise<string> {
    this.validateKey(key)

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ResponseContentType: mimeType,
      ResponseContentDisposition: `attachment; filename=${name}`
    })

    return getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds ?? S3_DOWNLOAD_URL_EXPIRES_S
    })
  }

  public getPublicUrl (
    key: string
  ): string {
    this.validateKey(key)

    return `${this._config.endpoint}/${this.bucketName}/${key}`
  }

  public async upload (key: string, content: Buffer, isPublic?: boolean): Promise<void> {
    this.validateKey(key)

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: content,
      ACL: isPublic === undefined ? 'public-read' : 'private'
    })

    await this.client.send(command, {
      requestTimeout: S3_UPLOAD_EXPIRES_MS
    })
  }

  public async download (key: string): Promise<Buffer> {
    this.validateKey(key)

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    })

    const result = await this.client.send(command)

    if (result.Body === undefined) {
      throw new Error(`Could not download ${key}`)
    }

    const chunks = await result.Body.transformToByteArray()

    return Buffer.from(chunks)
  }

  public async uploadStream (key: string, stream: Readable, isPublic?: boolean): Promise<void> {
    this.validateKey(key)

    const parallelUploads = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: stream,
        ACL: isPublic === undefined ? 'public-read' : 'private'
      },
      queueSize: 10,
      leavePartsOnError: false
    })

    await parallelUploads.done()
  }

  public async downloadStream (key: string): Promise<Readable> {
    this.validateKey(key)

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    })
    const result = await this.client.send(command)

    if (result.Body === undefined) {
      throw new Error(`Could not download ${key}`)
    }

    return result.Body as Readable
  }

  public async delete (key: string): Promise<void> {
    this.validateKey(key)

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key
    })

    await this.client.send(command)
  }

  public async list (options?: {
    prefix?: string
    startAfter?: string
  }): Promise<FileIndex[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: options?.prefix,
      StartAfter: options?.startAfter
    })

    const result = await this.client.send(command)

    return result.Contents?.map(item => ({
      key: item.Key,
      lastModified: item.LastModified
    })) ?? []
  }
}
