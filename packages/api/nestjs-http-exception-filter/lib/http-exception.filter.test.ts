import 'reflect-metadata'
import { describe, it } from 'node:test'
import { expect } from 'expect'
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import type { HttpAdapterHost } from '@nestjs/core'
import { HttpExceptionFilter } from './http-exception.filter.js'

describe('HttpExceptionFilter', () => {
  it('maps http exceptions to json api errors', () => {
    const { filter, reply } = createFilter()

    filter.catch(
      new HttpException('Missing', HttpStatus.NOT_FOUND),
      createArgumentsHost()
    )

    expect(reply.status).toBe(HttpStatus.NOT_FOUND)
    expect(reply.body).toEqual({
      errors: [{
        status: '404',
        code: 'HttpException',
        detail: 'Missing'
      }],
      traceId: null
    })
  })

  it('redacts internal server error details when configured', () => {
    const { filter, reply } = createFilter({
      hideInternalServerErrorDetails: true
    })

    filter.catch(
      new Error('db exploded'),
      createArgumentsHost()
    )

    expect(reply.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(reply.body).toEqual({
      errors: [{
        status: '500',
        code: 'internal_server_error',
        detail: 'The server was unable to complete your request. Please try again later.',
        meta: undefined
      }],
      traceId: null
    })
  })

  it('supports a custom internal server error message', () => {
    const { filter, reply } = createFilter({
      hideInternalServerErrorDetails: true,
      internalServerErrorMessage: 'Unexpected server error'
    })

    filter.catch(
      new Error('db exploded'),
      createArgumentsHost()
    )

    expect(reply.body).toEqual({
      errors: [{
        status: '500',
        code: 'internal_server_error',
        detail: 'Unexpected server error',
        meta: undefined
      }],
      traceId: null
    })
  })
})

function createFilter (options = {}) {
  const reply = {
    response: undefined as unknown,
    body: undefined as unknown,
    status: undefined as number | undefined
  }

  const httpAdapterHost = {
    httpAdapter: {
      reply: (response: unknown, body: unknown, status: number) => {
        reply.response = response
        reply.body = body
        reply.status = status
      }
    }
  } as HttpAdapterHost

  return {
    filter: new HttpExceptionFilter(httpAdapterHost, options),
    reply
  }
}

function createArgumentsHost (): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => ({})
    })
  } as ArgumentsHost
}
