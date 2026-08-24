import 'reflect-metadata'
import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, describe, it } from 'node:test'
import { Controller, Get, type INestApplication, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { expect } from 'expect'
import { IS_PUBLIC_KEY } from '@wisemen/nestjs-auth'
import type { FastifyInstance, LightMyRequestResponse } from 'fastify'
import { createSwaggerController } from '../swagger.controller.js'
import { SwaggerModule } from '../swagger.module.js'

const GUARDS_METADATA = '__guards__'
const SWAGGER_OUTPUT_DIR = join(tmpdir(), 'nestjs-swagger-controller-static')

@Controller('health')
class HealthController {
  @Get()
  health (): string {
    return 'ok'
  }
}

@Module({
  imports: [
    SwaggerModule.forRoot({
      controller: {
        route: '/api/docs',
        staticFilesDir: SWAGGER_OUTPUT_DIR
      }
    })
  ],
  controllers: [
    HealthController
  ]
})
class SwaggerControllerTestModule {}

describe('createSwaggerController', () => {
  it('marks docs handlers with basic auth when configured', () => {
    const controller = createSwaggerController({
      route: '/api/docs',
      basicAuth: 'docs'
    }) as { prototype: Record<string, object> }
    const indexGuards = Reflect.getMetadata(GUARDS_METADATA, controller.prototype.handleIndex) as Array<{ name?: string }>
    const cssGuards = Reflect.getMetadata(GUARDS_METADATA, controller.prototype.handleCss) as Array<{ name?: string }>
    const faviconGuards = Reflect.getMetadata(GUARDS_METADATA, controller.prototype.handleFavicon16) as Array<{ name?: string }>

    expect(indexGuards[0]?.name).toBe('BasicAuthGuard')
    expect(cssGuards[0]?.name).toBe('BasicAuthGuard')
    expect(faviconGuards[0]?.name).toBe('BasicAuthGuard')
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, controller.prototype.handleRedirect)).toBe(true)
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, controller.prototype.handleIndex)).toBeUndefined()
  })

  it('marks docs handlers as public when basic auth is not configured', () => {
    const controller = createSwaggerController({
      route: '/api/docs'
    }) as { prototype: Record<string, object> }

    expect(Reflect.getMetadata(IS_PUBLIC_KEY, controller.prototype.handleIndex)).toBe(true)
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, controller.prototype.handleLatest)).toBe(true)
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, controller.prototype.handleRedirect)).toBe(true)
  })
})

describe('swagger controller routes', () => {
  const cleanupPaths = new Set<string>()

  after(async () => {
    await Promise.all(
      [...cleanupPaths].map(async path => rm(path, { recursive: true, force: true }))
    )
  })

  it('returns 503 for docs routes until the json docs are generated', async () => {
    const app = await createApp()
    cleanupPaths.add(SWAGGER_OUTPUT_DIR)
    await rm(SWAGGER_OUTPUT_DIR, { recursive: true, force: true })

    try {
      const response = await inject(app, '/api/docs')
      const payload = JSON.parse(response.body) as { message: string }

      expect(response.statusCode).toBe(503)
      expect(payload.message).toBe('Swagger docs have not been generated yet')
    } finally {
      await app.close()
    }
  })

  it('serves html, json, ui assets and favicons after docs generation', async () => {
    const app = await createApp()
    cleanupPaths.add(SWAGGER_OUTPUT_DIR)
    await rm(SWAGGER_OUTPUT_DIR, { recursive: true, force: true })

    try {
      await SwaggerModule.generateStaticDocs(app, {
        servers: ['http://localhost:3000']
      })

      const html = await inject(app, '/api/docs')
      const latestHtml = await inject(app, '/api/docs/latest')
      const latestJson = await inject(app, '/api/docs/latest-json')
      const css = await inject(app, '/api/docs/swagger-ui.css')
      const bundle = await inject(app, '/api/docs/swagger-ui-bundle.js')
      const favicon = await inject(app, '/api/docs/favicon-32x32.png')
      const redirect = await inject(app, '/oauth2-redirect')
      const latestJsonPayload = JSON.parse(latestJson.body) as {
        info: {
          title: string
        }
      }

      expect(html.statusCode).toBe(200)
      expect(html.headers['content-type']).toContain('text/html')
      expect(html.body).toContain('/api/docs/swagger-ui.css')
      expect(latestHtml.body).toContain('/api/docs/latest-json')
      expect(latestJson.statusCode).toBe(200)
      expect(latestJsonPayload.info.title).toBe('API Documentation')
      expect(css.headers['content-type']).toContain('text/css')
      expect(bundle.headers['content-type']).toContain('application/javascript')
      expect(favicon.headers['content-type']).toContain('image/png')
      expect(redirect.statusCode).toBe(200)
      expect(redirect.headers['content-type']).toContain('text/html')
    } finally {
      await app.close()
    }
  })
})

async function createApp () {
  const app = await NestFactory.create(SwaggerControllerTestModule, new FastifyAdapter(), {
    logger: false
  })

  await app.init()
  await getFastifyInstance(app).ready()

  return app
}

async function inject (
  app: INestApplication,
  url: string
) : Promise<LightMyRequestResponse> {
  return await getFastifyInstance(app).inject({
    method: 'GET',
    url
  })
}

function getFastifyInstance (app: INestApplication): FastifyInstance {
  const instance: unknown = app.getHttpAdapter().getInstance()

  return instance as FastifyInstance
}
