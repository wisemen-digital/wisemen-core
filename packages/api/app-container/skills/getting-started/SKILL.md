---
name: getting-started
description: Use when bootstrapping NestJS api, worker, or job containers with Express or Fastify.
---

# @wisemen/app-container - Getting Started

Extend `ExpressContainer` or `FastifyContainer` to bootstrap a Nest app with
built-in startup, shutdown, and probe endpoints. Use `JobContainer` for
run-once processes and `WorkerContainer` for long-running consumers.

```ts
import { NestFactory } from '@nestjs/core'
import { Module, type INestApplicationContext } from '@nestjs/common'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { FastifyContainer } from '@wisemen/app-container/fastify'

@Module({})
class AppModule {}

class Api extends FastifyContainer {
  async bootstrap (adapter: FastifyAdapter): Promise<INestApplicationContext> {
    const app = await NestFactory.create(AppModule, adapter)

    app.setGlobalPrefix('api')
    app.enableCors()

    return app
  }
}

const _api = new Api()
```

Use `@wisemen/app-container/express` for Express-based apps. Switch to
`JobContainer` when the process should execute work once and shut down after
`execute()`.
