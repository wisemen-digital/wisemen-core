---
name: getting-started
description: >
  Register FileStorageModule with S3 or Azure Blob Storage, inject FileStorage for
  uploads, downloads, and signed URLs. Use TestFileStorage for unit tests.
type: lifecycle
library: nestjs-file-storage
exports:
  - FileStorageModule
  - FileStorage
  - FileStorageProvider
  - TestFileStorage
---

# @wisemen/nestjs-file-storage — Getting Started

Multi-cloud file storage abstraction for NestJS supporting AWS S3 and Azure Blob Storage with signed URL generation.

## When to Use

- Storing and retrieving files in cloud storage (S3, Azure Blob)
- Generating temporary signed URLs for uploads, downloads, and previews
- Abstracting storage provider behind a common interface for portability

**Use instead:** Direct AWS SDK or Azure SDK when you need provider-specific features not exposed by FileStorage.

## Import

```ts
import {
  FileStorageModule, FileStorage, FileStorageProvider, TestFileStorage,
} from '@wisemen/nestjs-file-storage'
```

## Quick Start

### 1. Register the module

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileStorageModule, FileStorageProvider } from '@wisemen/nestjs-file-storage'

@Module({
  imports: [
    FileStorageModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        provider: FileStorageProvider.AWS_S3,
        config: {
          accessKeyId: config.getOrThrow('S3_ACCESS_KEY'),
          secretAccessKey: config.getOrThrow('S3_SECRET_KEY'),
          region: config.getOrThrow('S3_REGION'),
          endpoint: config.getOrThrow('S3_ENDPOINT'),
          bucketName: config.getOrThrow('S3_BUCKET'),
        },
      }),
    }),
  ],
})
export class StorageModule {}
```

### 2. Inject and use FileStorage

```ts
import { Injectable } from '@nestjs/common'
import { FileStorage } from '@wisemen/nestjs-file-storage'

@Injectable()
export class DocumentService {
  constructor(private readonly storage: FileStorage) {}

  async upload(key: string, content: Buffer): Promise<void> {
    await this.storage.upload(key, content)
  }

  async getDownloadUrl(key: string, filename: string): Promise<string> {
    return this.storage.createTemporaryDownloadUrl(key, filename)
  }

  async getPreviewUrl(key: string): Promise<string> {
    return this.storage.createTemporaryPreviewUrl(key)
  }
}
```

### 3. Use TestFileStorage in tests

```ts
import { FileStorageModule, FileStorageProvider } from '@wisemen/nestjs-file-storage'

// In test module setup:
FileStorageModule.forRoot({ provider: FileStorageProvider.TEST })
```

`TestFileStorage` is an in-memory implementation that satisfies the FileStorage interface without cloud credentials.

## Source Files

For full API details, read the source files.

- Module: `src/file-storage.module.ts`
- Abstract provider: `src/providers/file-storage-provider.ts`
- Provider enum: `src/providers/provider.enum.ts`
- S3 implementation: `src/providers/s3/`
- Azure implementation: `src/providers/azure-blob-storage/`
- Test implementation: `src/providers/test/test-file-storage.ts`
