import { describe, it } from 'node:test'
import { expect } from 'expect'
import { AzureBlobStorage } from '#src/providers/azure-blob-storage/azure-blob-storage.js'

describe('Azure Blob Storage - validateKey', () => {
  const azureBlobStorage = new AzureBlobStorage({
    accountName: 'test-account',
    accountKey: 'test-key',
    containerName: 'test-container',
    endpoint: 'https://test-account.blob.core.windows.net'
  })

  describe('Invalid Keys (Should Throw)', () => {
    it('throws if key is empty', () => {
      expect(() => azureBlobStorage.validateKey('')).toThrow()
    })

    it('throws if key exceeds 1024 characters', () => {
      const longKey = 'a'.repeat(1025)
      expect(() => azureBlobStorage.validateKey(longKey)).toThrow()
    })

    it('throws if a path segment ends with a dot', () => {
      expect(() => azureBlobStorage.validateKey('container/folder./file.txt')).toThrow()
    })

    it('throws if the path ends with a forward slash', () => {
      expect(() => azureBlobStorage.validateKey('container/folder/')).toThrow()
    })

    it('throws if the path ends with a backslash', () => {
      expect(() => azureBlobStorage.validateKey('container/file.txt\\')).toThrow()
    })

    it('throws if the key ends with a dot', () => {
      expect(() => azureBlobStorage.validateKey('container/file.')).toThrow()
    })
  })

  describe('Valid Keys (Should Pass)', () => {
    it('accepts a simple filename (optional container)', () => {
      expect(() => azureBlobStorage.validateKey('file.txt')).not.toThrow()
    })

    it('accepts a container with uppercase letters', () => {
      expect(() => azureBlobStorage.validateKey('My-Container/file.txt')).not.toThrow()
    })

    it('accepts a container with consecutive hyphens', () => {
      expect(() => azureBlobStorage.validateKey('my--container/file.txt')).not.toThrow()
    })

    it('accepts a full path with a valid container', () => {
      expect(() => azureBlobStorage.validateKey('my-valid-container-123/image.png')).not.toThrow()
    })

    it('accepts nested directories', () => {
      expect(() => azureBlobStorage.validateKey('container/v1/backups/db.tar.gz')).not.toThrow()
    })

    it('accepts complex characters in the blob name', () => {
      expect(() => azureBlobStorage.validateKey('container/user@data!#$.json')).not.toThrow()
    })

    it('accepts spaces in the blob name', () => {
      expect(() => azureBlobStorage.validateKey('container/space file.txt')).not.toThrow()
    })
  })
})
