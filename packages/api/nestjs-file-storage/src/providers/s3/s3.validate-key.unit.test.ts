import { describe, it } from 'node:test'
import { expect } from 'expect'
import { S3 } from '#src/providers/s3/s3.js'

describe('S3 - validateKey', () => {
  const s3 = new S3({
    accessKeyId: 'test-access-key-id',
    bucketName: 'test-bucket',
    region: 'us-east-1',
    secretAccessKey: 'test-secret-access-key',
    endpoint: 'https://s3.amazonaws.com'
  })

  describe('Invalid Keys (Should Throw)', () => {
    it('throws if key is empty', () => {
      expect(() => s3.validateKey('')).toThrow()
    })

    it('throws if key exceeds 1024 characters', () => {
      const longKey = 'a'.repeat(1025)
      expect(() => s3.validateKey(longKey)).toThrow()
    })

    it('throws if key starts with "./"', () => {
      expect(() => s3.validateKey('./file.txt')).toThrow()
    })

    it('throws if any path segment is "." or ".."', () => {
      expect(() => s3.validateKey('bucket/./file.txt')).toThrow()
      expect(() => s3.validateKey('bucket/../file.txt')).toThrow()
    })

    it('throws if key contains unsupported characters', () => {
      expect(() => s3.validateKey('bucket/space file.txt')).toThrow()
      expect(() => s3.validateKey('bucket/with&and.txt')).toThrow()
    })
  })

  describe('Valid Keys (Should Pass)', () => {
    it('accepts a simple filename', () => {
      expect(() => s3.validateKey('file.txt')).not.toThrow()
    })

    it('accepts dots at the end of path segments (unlike Azure)', () => {
      expect(() => s3.validateKey('my-bucket/folder./file.txt')).not.toThrow()
    })

    it('accepts trailing slashes (virtual directories)', () => {
      expect(() => s3.validateKey('my-bucket/folder/')).not.toThrow()
    })

    it('accepts bucket names with dots', () => {
      expect(() => s3.validateKey('my.org.bucket/data.csv')).not.toThrow()
    })

    it('accepts special characters common in S3 keys', () => {
      expect(() => s3.validateKey('bucket/!-_.*\'()/file.json')).not.toThrow()
    })
  })
})
