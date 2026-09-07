import { Readable } from 'stream'
import { describe, it } from 'node:test'
import { expect } from 'expect'
import { PutObjectCommandInput } from '@aws-sdk/client-s3'
import { S3 } from '#src/providers/s3/s3.js'

interface CapturedCommand {
  input: PutObjectCommandInput
}

interface S3Internals {
  _client: {
    send: (command: CapturedCommand) => Promise<unknown>
  }
}

function createS3WithCapturedAcl (): { s3: S3, getAcl: () => string | undefined } {
  const s3 = new S3({
    accessKeyId: 'test-access-key-id',
    bucketName: 'test-bucket',
    region: 'us-east-1',
    secretAccessKey: 'test-secret-access-key',
    endpoint: 'https://s3.amazonaws.com'
  })

  let acl: string | undefined

  const internals = s3 as unknown as S3Internals

  internals._client.send = (command: CapturedCommand): Promise<unknown> => {
    acl = command.input.ACL

    return Promise.resolve({})
  }

  return { s3, getAcl: () => acl }
}

describe('S3 - upload ACL', () => {
  it('uploads as private when isPublic is not provided', async () => {
    const { s3, getAcl } = createS3WithCapturedAcl()

    await s3.upload('folder/file.txt', Buffer.from('test'))

    expect(getAcl()).toBe('private')
  })

  it('uploads as private when isPublic is false', async () => {
    const { s3, getAcl } = createS3WithCapturedAcl()

    await s3.upload('folder/file.txt', Buffer.from('test'), false)

    expect(getAcl()).toBe('private')
  })

  it('uploads as public-read when isPublic is true', async () => {
    const { s3, getAcl } = createS3WithCapturedAcl()

    await s3.upload('folder/file.txt', Buffer.from('test'), true)

    expect(getAcl()).toBe('public-read')
  })
})

describe('S3 - uploadStream ACL', () => {
  it('streams as private when isPublic is not provided', async () => {
    const { s3, getAcl } = createS3WithCapturedAcl()

    await s3.uploadStream('folder/file.txt', Readable.from(['test']))

    expect(getAcl()).toBe('private')
  })

  it('streams as private when isPublic is false', async () => {
    const { s3, getAcl } = createS3WithCapturedAcl()

    await s3.uploadStream('folder/file.txt', Readable.from(['test']), false)

    expect(getAcl()).toBe('private')
  })

  it('streams as public-read when isPublic is true', async () => {
    const { s3, getAcl } = createS3WithCapturedAcl()

    await s3.uploadStream('folder/file.txt', Readable.from(['test']), true)

    expect(getAcl()).toBe('public-read')
  })
})
