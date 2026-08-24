import { readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, describe, it } from 'node:test'
import { Controller, Get, type INestApplication, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { ApiOperation } from '@nestjs/swagger'
import { expect } from 'expect'
import type { FastifyInstance } from 'fastify'
import { SwaggerModule } from '../swagger.module.js'

const SWAGGER_OUTPUT_DIR = join(tmpdir(), 'nestjs-swagger-docs-static')

@Controller('examples')
class ExampleController {
  @Get('active')
  active (): string {
    return 'active'
  }

  @Get('deprecated')
  @ApiOperation({ deprecated: true })
  deprecated (): string {
    return 'deprecated'
  }
}

@Module({
  imports: [
    SwaggerModule.forRoot({
      controller: {
        staticFilesDir: SWAGGER_OUTPUT_DIR
      }
    })
  ],
  controllers: [
    ExampleController
  ]
})
class SwaggerDocsTestModule {}

describe('SwaggerModule.writeSwaggerJsonDocs', () => {
  const cleanupPaths = new Set<string>()

  after(async () => {
    await Promise.all(
      [...cleanupPaths].map(async path => rm(path, { recursive: true, force: true }))
    )
  })

  it('writes index, latest and all json files and static html shells', async () => {
    const app = await NestFactory.create(SwaggerDocsTestModule, new FastifyAdapter(), {
      logger: false
    })
    cleanupPaths.add(SWAGGER_OUTPUT_DIR)
    await rm(SWAGGER_OUTPUT_DIR, { recursive: true, force: true })

    await app.init()
    await getFastifyInstance(app).ready()

    try {
      const writtenDocs = await SwaggerModule.generateStaticDocs(app, {
        servers: ['http://localhost:3000']
      })

      const indexDocument = JSON.parse(await readFile(writtenDocs.indexPath, 'utf8')) as Record<string, unknown>
      const latestDocument = JSON.parse(await readFile(writtenDocs.latestPath, 'utf8')) as {
        paths: Record<string, Record<string, unknown>>
      }
      const allDocument = JSON.parse(await readFile(writtenDocs.allPath, 'utf8')) as {
        paths: Record<string, Record<string, unknown>>
      }
      const latestHtml = await readFile(writtenDocs.latestHtmlPath, 'utf8')

      expect(indexDocument.info).toBeDefined()
      expect(latestDocument.paths['/examples/active']).toBeDefined()
      expect(latestDocument.paths['/examples/deprecated']?.get).toBeUndefined()
      expect(allDocument.paths['/examples/deprecated']?.get).toBeDefined()
      expect(latestHtml).toContain('/api/docs/latest-json')
    } finally {
      await app.close()
    }
  })
})

function getFastifyInstance (app: INestApplication): FastifyInstance {
  const instance: unknown = app.getHttpAdapter().getInstance()

  return instance as FastifyInstance
}
