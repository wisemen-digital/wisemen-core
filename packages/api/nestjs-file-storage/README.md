# File Storage

This package provides NestJS integration to interact with various file storage providers.

## Supported Providers

- Amazon S3
- Azure Blob Storage

## Installation

```bash
npm install @wisemen/nestjs-file-storage
```

## Basic Usage

1. Import the `FileStorageModule` into your NestJS module.

```ts
import {
  FileStorageModule,
  FileStorageProvider,
} from "@wisemen/nestjs-file-storage";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    FileStorageModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        provider: FileStorageProvider.AWS_S3,
        config: {
          bucketName: configService.getOrThrow("S3_BUCKET"),
          region: configService.get("S3_REGION", "nl-ams"),
          accessKeyId: configService.getOrThrow("S3_ACCESS_KEY"),
          secretAccessKey: configService.getOrThrow("S3_SECRET_KEY"),
          endpoint: configService.getOrThrow("S3_ENDPOINT"),
        },
      }),
    }),
  ],
  providers: [MyService],
})
export class SomeModule {}
```

2. Inject the `FileStorageService` into your service to interact with the file storage.

```ts
import { Injectable } from "@nestjs/common";
import { FileStorageService } from "@wisemen/nestjs-file-storage";
import { Readable } from "stream";
@Injectable()
export class MyService {
  constructor(private fileStorage: FileStorage) {}
  async upload(key: string, content: Buffer): Promise<void> {
    await this.fileStorage.upload(key, content);
  }

  async uploadStream(key: string, stream: Readable): Promise<void> {
    await this.fileStorage.upload(key, stream);
  }
}
```

## Features

- Create temporary upload/download URLs
- Create temporary preview URLs for inline browser rendering
- Upload file using buffers or streams
- Download file
- Delete file

## URL Types

- `createTemporaryPreviewUrl(...)`: creates a temporary signed read URL intended for inline preview in the browser.
- `createTemporaryDownloadUrl(...)`: creates a temporary signed read URL that forces a file download.
- `getPublicUrl(...)`: returns the public object URL and only works when the file is already publicly accessible.
