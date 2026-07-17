import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import { describe, it } from 'node:test'
import { expect } from 'expect'
import { S3 } from '#src/providers/s3/s3.js'

describe('S3 - createUploadWritable', () => {
  it('resolves the pipeline after the upload completed', async () => {
    const s3 = new S3({
      accessKeyId: 'test-access-key-id',
      bucketName: 'test-bucket',
      region: 'us-east-1',
      secretAccessKey: 'test-secret-access-key',
      endpoint: 'https://s3.amazonaws.com'
    })

    let uploadedContent = ''
    let uploadCompleted = false

    s3.uploadStream = async (_key, stream) => {
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
      s3.createUploadWritable('folder/file.txt')
    )

    expect(uploadedContent).toBe('hello world')
    expect(uploadCompleted).toBe(true)
  })
})
