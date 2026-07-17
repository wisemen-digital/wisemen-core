import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import { describe, it } from 'node:test'
import { expect } from 'expect'
import { AzureBlobStorage } from '#src/providers/azure-blob-storage/azure-blob-storage.js'

describe('Azure Blob Storage - createUploadWritable', () => {
  it('resolves the pipeline after the upload completed', async () => {
    const azureBlobStorage = new AzureBlobStorage({
      accountName: 'test-account',
      accountKey: 'test-key',
      containerName: 'test-container',
      endpoint: 'https://test-account.blob.core.windows.net'
    })

    let uploadedContent = ''
    let uploadCompleted = false

    azureBlobStorage.uploadStream = async (_key, stream) => {
      const chunks: Buffer[] = []

      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      }

      await new Promise(resolve => setTimeout(resolve, 10))
      uploadedContent = Buffer.concat(chunks).toString('utf8')
      uploadCompleted = true
    }

    await pipeline(
      Readable.from(['hello', ' ', 'world']),
      azureBlobStorage.createUploadWritable('folder/file.txt')
    )

    expect(uploadedContent).toBe('hello world')
    expect(uploadCompleted).toBe(true)
  })
})
