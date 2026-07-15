import type { HttpHandler } from 'msw'
import {
  http,
  HttpResponse,
} from 'msw'

import { PaginationTestUtil } from '@/page-objects/pagination.page-object'

/**
 * Configuration for a {@link CrudHandlerFactory}.
 */
export interface CrudHandlerFactoryOptions {
  /** The base URL prefix. Defaults to a wildcard host with the `/api/v1` path. */
  baseUrl?: string
  /** The collection endpoint, e.g. `'users'`. */
  endpoint: string
  /** The pagination shape used by `getIndex`. Defaults to `'offset'`. */
  paginationType?: 'keyset' | 'offset'
}

/**
 * Factory that produces MSW handlers for the standard CRUD endpoints of a
 * single resource collection.
 *
 * @example
 * ```ts
 * const factory = new CrudHandlerFactory<UserDto>({ endpoint: 'users' })
 * const handlers = [
 *   factory.getIndex([user]),
 *   factory.getDetail(user),
 * ]
 * ```
 */
export class CrudHandlerFactory<T extends Record<string, unknown>> {
  private readonly baseUrl: string
  private readonly endpoint: string
  private readonly paginationType: 'keyset' | 'offset'

  constructor(options: CrudHandlerFactoryOptions) {
    this.endpoint = options.endpoint
    this.baseUrl = options.baseUrl ?? '*/api/v1'
    this.paginationType = options.paginationType ?? 'offset'
  }

  /**
   * Build the collection path, joining the base URL and endpoint,
   * e.g. the `users` endpoint under the default base URL.
   */
  private collectionPath(): string {
    return `${this.baseUrl}/${this.endpoint}`
  }

  /**
   * Build the resource path. Uses the object's `uuid` when present,
   * otherwise falls back to a wildcard segment.
   */
  private resourcePath(data: T): string {
    const uuid = typeof data.uuid === 'string' ? data.uuid : null

    if (uuid !== null) {
      return `${this.baseUrl}/${this.endpoint}/${uuid}`
    }

    return `${this.baseUrl}/${this.endpoint}/*`
  }

  /**
   * POST to the collection, returning `response` with a `201` status.
   */
  create(response: Record<string, unknown>): HttpHandler {
    return http.post(this.collectionPath(), () => {
      return HttpResponse.json(response, {
        status: 201,
      })
    })
  }

  /**
   * DELETE a resource, returning an empty `204` response.
   */
  delete(): HttpHandler {
    return http.delete(`${this.baseUrl}/${this.endpoint}/*`, () => {
      return new HttpResponse(null, {
        status: 204,
      })
    })
  }

  /**
   * GET a single resource.
   */
  getDetail(data: T): HttpHandler {
    return http.get(this.resourcePath(data), () => {
      return HttpResponse.json(data)
    })
  }

  /**
   * GET the collection, returning `data` wrapped in the configured
   * pagination shape.
   */
  getIndex(data: T[]): HttpHandler {
    const body = this.paginationType === 'keyset'
      ? PaginationTestUtil.toKeysetPaginationResponse(data)
      : PaginationTestUtil.toOffsetPaginationResponse(data)

    return http.get(this.collectionPath(), () => {
      return HttpResponse.json(body)
    })
  }

  /**
   * PATCH a single resource, returning the updated `data`.
   */
  update(data: T): HttpHandler {
    return http.patch(this.resourcePath(data), () => {
      return HttpResponse.json(data)
    })
  }
}
