import { Readable } from 'stream'
import { Injectable } from '@nestjs/common'
import { FileIndex, FileStorage } from '#src/providers/file-storage-provider.js'

@Injectable()
export class TestFileStorage extends FileStorage {
  createTemporaryUploadUrl (
    _key: string,
    _mimeType: string,
    _expiresInSeconds?: number
  ): Promise<string> {
    return Promise.resolve('https://local.test/upload-url')
  }

  createTemporaryPreviewUrl (
    _key: string,
    _mimeType?: string,
    _expiresInSeconds?: number
  ): Promise<string> {
    return Promise.resolve('https://local.test/preview-url')
  }

  createTemporaryDownloadUrl (
    _key: string,
    _name: string,
    _mimeType?: string,
    _expiresInSeconds?: number
  ): Promise<string> {
    return Promise.resolve('https://local.test/download-url')
  }

  getPublicUrl (
    _key: string
  ): string {
    return 'https://local.test/public-url'
  }

  upload (_key: string, _content: Buffer): Promise<void> {
    return Promise.resolve()
  }

  download (_key: string): Promise<Buffer> {
    return Promise.resolve(Buffer.from('test'))
  }

  uploadStream (_key: string, _stream: Readable): Promise<void> {
    return Promise.resolve()
  }

  downloadStream (_key: string): Promise<Readable> {
    const stream = new Readable()
    stream.push('test')
    stream.push(null)

    return Promise.resolve(stream)
  }

  delete (_key: string): Promise<void> {
    return Promise.resolve()
  }

  list (): Promise<FileIndex[]> {
    return Promise.resolve([])
  }
}
