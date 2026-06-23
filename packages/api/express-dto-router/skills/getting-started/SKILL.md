---
name: getting-started
description: Use when building Express routes with validated body and query DTOs plus standardized error responses.
---

# @appwise/express-dto-router - Getting Started

Use `DtoRouter` when an Express route should validate request DTOs before it reaches the controller. Extend `Dto` for request models, register them in `dtos`, and throw `CustomError` for client-facing failures.

```ts
import { IsOptional, IsString } from 'class-validator'
import express from 'express'
import {
  ControllerOptions,
  CustomError,
  Dto,
  DtoRouter,
} from '@appwise/express-dto-router'

class CreateUserBodyDto extends Dto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  role?: string
}

class ListUsersQueryDto extends Dto {
  @IsOptional()
  @IsString()
  search?: string
}

class UsersController {
  async createUser (
    { body, query }: ControllerOptions<{ body: CreateUserBodyDto, query: ListUsersQueryDto }>
  ) {
    if (body.name === 'blocked') {
      throw new CustomError('validation_error')
    }

    return {
      name: body.name,
      search: query?.search ?? null
    }
  }
}

const controller = new UsersController()
const router = new DtoRouter()

router.post({
  path: '/users',
  dtos: {
    body: CreateUserBodyDto,
    query: ListUsersQueryDto
  },
  controller: controller.createUser.bind(controller)
})

router.uuidParam('userUuid')

const app = express()
app.use(express.json())
app.use(router.router)
app.use((err, req, res, _next) => {
  DtoRouter.handleError(err, req, res).catch(console.error)
})
```

Use `groups` inside `dtos` when the same DTO class needs different validation rules per route. Return `ApiResponse` instead of plain JSON when the route must control headers or status handling explicitly.
