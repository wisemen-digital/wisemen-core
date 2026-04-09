import { Readable } from 'stream'
import { BlobSASPermissions, BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { validateSync } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { AzureBlobStorageConfig } from '#src/providers/azure-blob-storage/azure-blob-storage.config.js'
import { AZURE_BLOB_STORAGE_DOWNLOAD_URL_EXPIRES_S, AZURE_BLOB_STORAGE_UPLOAD_URL_EXPIRES_S } from '#src/providers/azure-blob-storage/azure-blob-storage.constants.js'
import { FileIndex, FileStorage } from '#src/providers/file-storage-provider.js'

@Injectable()
export class AzureBlobStorage extends FileStorage {
  private readonly client: BlobServiceClient
  private readonly containerClient: ContainerClient

  constructor (
    private readonly _config: AzureBlobStorageConfig
  ) {
    super()

    this.validateConfig(_config)

    const sharedKeyCredential = new StorageSharedKeyCredential(
      this._config.accountName,
      this._config.accountKey
    )
    const url = this._config.endpoint

    this.client = new BlobServiceClient(url, sharedKeyCredential)

    this.containerClient = this.client.getContainerClient(this._config.containerName)
  }

  private validateConfig (config: AzureBlobStorageConfig): void {
    const validationDto = plainToClass(
      AzureBlobStorageConfig,
      config,
      { enableImplicitConversion: true }
    )
    const errors = validateSync(validationDto, { skipMissingProperties: false, whitelist: true })

    if (errors.length > 0) {
      throw new Error(errors.toString())
    }
  }

  validateKey (key: string): void {
    // Reference: https://learn.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata

    // Regex Breakdown:
    //  (?=.{1,1024}$) → length 1..1024
    // (?!.*\.(?:[\/\\]|$)) → no . immediately before / or \ or end (no segment ends with .)
    // (?!.*[.\/\\]$) → cannot end with ., /, or \
    // [\s\S]+ → allow any characters (including unicode, spaces, etc.)

    // eslint-disable-next-line no-useless-escape
    const regex = /^(?=.{1,1024}$)(?!.*\.(?:[\/\\]|$))(?!.*[.\/\\]$)[\s\S]+$/

    if (!regex.test(key)) {
      throw new Error(`Invalid Azure Blob Storage key: ${key}`)
    }
  }

  public async createTemporaryUploadUrl (
    key: string,
    mimeType: string,
    expiresInSeconds?: number
  ): Promise<string> {
    this.validateKey(key)

    const blobClient = this.containerClient.getBlockBlobClient(key)

    const expiresIn = expiresInSeconds ?? AZURE_BLOB_STORAGE_UPLOAD_URL_EXPIRES_S

    return await blobClient.generateSasUrl({
      permissions: BlobSASPermissions.from({ write: true }),
      expiresOn: dayjs().add(expiresIn, 'second').toDate(),
      contentType: mimeType
    })
  }

  public async createTemporaryPreviewUrl (
    key: string,
    mimeType?: string,
    expiresInSeconds?: number
  ): Promise<string> {
    this.validateKey(key)

    const blobClient = this.containerClient.getBlockBlobClient(key)

    const expiresIn = expiresInSeconds ?? AZURE_BLOB_STORAGE_DOWNLOAD_URL_EXPIRES_S

    return await blobClient.generateSasUrl({
      permissions: BlobSASPermissions.from({ read: true }),
      expiresOn: dayjs().add(expiresIn, 'second').toDate(),
      contentType: mimeType,
      contentDisposition: 'inline'
    })
  }

  public async createTemporaryDownloadUrl (
    key: string,
    name: string,
    mimeType?: string,
    expiresInSeconds?: number
  ): Promise<string> {
    this.validateKey(key)

    const blobClient = this.containerClient.getBlockBlobClient(key)

    const expiresIn = expiresInSeconds ?? AZURE_BLOB_STORAGE_DOWNLOAD_URL_EXPIRES_S

    return await blobClient.generateSasUrl({
      permissions: BlobSASPermissions.from({ read: true }),
      expiresOn: dayjs().add(expiresIn, 'second').toDate(),
      contentType: mimeType,
      contentDisposition: `attachment; filename="${name}"`
    })
  }

  public getPublicUrl (
    key: string
  ): string {
    this.validateKey(key)

    const blobClient = this.containerClient.getBlockBlobClient(key)

    return blobClient.url
  }

  public async upload (
    key: string,
    content: Buffer
  ): Promise<void> {
    this.validateKey(key)

    const blobClient = this.containerClient.getBlockBlobClient(key)

    await blobClient.uploadData(content)
  }

  public async download (
    key: string
  ): Promise<Buffer> {
    this.validateKey(key)

    const blobClient = this.containerClient.getBlockBlobClient(key)

    return await blobClient.downloadToBuffer()
  }

  public async uploadStream (
    key: string,
    stream: Readable
  ): Promise<void> {
    this.validateKey(key)

    const blobClient = this.containerClient.getBlockBlobClient(key)

    await blobClient.uploadStream(stream)
  }

  public async downloadStream (
    key: string
  ): Promise<Readable> {
    this.validateKey(key)

    const blobClient = this.containerClient.getBlockBlobClient(key)

    const downloadResponse = await blobClient.download()

    if (downloadResponse.readableStreamBody === undefined) {
      throw new Error(`Could not download stream for ${key}`)
    }

    return downloadResponse.readableStreamBody as Readable
  }

  public async delete (
    key: string
  ): Promise<void> {
    this.validateKey(key)

    const blobClient = this.containerClient.getBlockBlobClient(key)

    await blobClient.deleteIfExists()
  }

  public async list (options?: {
    prefix?: string
    startAfter?: string
  }): Promise<FileIndex[]> {
    const blobs = this.containerClient.listBlobsFlat({
      prefix: options?.prefix,
      startFrom: options?.startAfter
    })

    const result: {
      key?: string
      lastModified?: Date
    }[] = []

    for await (const blob of blobs) {
      result.push({
        key: blob.name,
        lastModified: blob.properties.lastModified
      })
    }

    return result
  }
}
