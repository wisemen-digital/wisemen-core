/* eslint-disable @typescript-eslint/naming-convention */
import { TestFileStorage } from './test/test-file-storage.js'
import { FileStorageProvider } from './provider.enum.js'
import { FileStorage } from './file-storage-provider.js'
import { exhaustiveCheck } from '#src/helpers/exhaustive-check.helper.js'
import { FileStorageOptions } from '#src/file-storage.module.js'

export function fileStorageFactory (
  options: FileStorageOptions
): Promise<FileStorage> {
  switch (options.provider) {
    case FileStorageProvider.AWS_S3: {
      return import('./s3/s3.js')
        .then(({ S3 }) => Promise.resolve(new S3(options.config)))
    }
    case FileStorageProvider.AZURE_BLOB_STORAGE: {
      return import('./azure-blob-storage/azure-blob-storage.js')
        .then(({ AzureBlobStorage }) => new AzureBlobStorage(options.config))
    }
    case FileStorageProvider.TEST: {
      return Promise.resolve(new TestFileStorage())
    }
    default:
      exhaustiveCheck(options)
  }
}
