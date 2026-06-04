---
name: getting-started
description: S3 or Azure Blob storage for NestJS. Use when uploading, downloading, etc files.
---

Multi-cloud file storage abstraction for NestJS supporting AWS S3 and Azure Blob Storage.

## When to Use

- Storing and retrieving files in cloud storage (S3, Azure Blob)
- Generating temporary signed URLs for uploads, downloads, and previews
- Abstracting storage provider behind a common interface for portability

## Import

```ts
import { FileStorageModule, FileStorage, FileStorageProvider, TestFileStorage } from '@wisemen/nestjs-file-storage'
```

### Inject and use FileStorage

```ts
import { Injectable } from '@nestjs/common'
import { FileStorage } from '@wisemen/nestjs-file-storage'

@Injectable()
export class ExampleUseCase {
  constructor(private storage: FileStorage) {}

  async example(key: string, content: Buffer): Promise<void> {
    await this.storage.upload(key, content)
  }
}
```

## Source Files

For full API details, read the source files.
- Abstract provider
- S3 implementation
- Azure implementation
- Test implementation
