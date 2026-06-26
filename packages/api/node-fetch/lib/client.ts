import { createInterceptors, Interceptors } from './interceptors.js'
import type { Middleware } from './interceptors.js'

export interface ClientConfig {
  /** Prepended to every relative URL. */
  baseUrl?: string
  /** Custom fetch implementation. Defaults to `globalThis.fetch`. */
  fetch?: typeof fetch
  /** Default headers merged into every request. */
  headers?: HeadersInit
}

export interface FetchClient {
  interceptors: Middleware<Request, Response, unknown, Request>
  /** Raw fetch — same signature as the global, but with interceptors applied. */
  fetch: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  get: (input: string | URL, init?: RequestInit) => Promise<Response>
  post: (input: string | URL, init?: RequestInit) => Promise<Response>
  put: (input: string | URL, init?: RequestInit) => Promise<Response>
  patch: (input: string | URL, init?: RequestInit) => Promise<Response>
  delete: (input: string | URL, init?: RequestInit) => Promise<Response>
  head: (input: string | URL, init?: RequestInit) => Promise<Response>
  options: (input: string | URL, init?: RequestInit) => Promise<Response>
}

const mergeHeaders = (...sources: Array<HeadersInit | undefined>): Headers => {
  const result = new Headers()
  for (const source of sources) {
    if (!source) continue
    new Headers(source).forEach((value, key) => result.set(key, value))
  }
  return result
}

const resolveUrl = (baseUrl: string | undefined, input: string | URL | Request): string => {
  if (input instanceof Request) return input.url
  const str = input.toString()
  if (!baseUrl || str.startsWith('http://') || str.startsWith('https://')) return str
  return baseUrl.replace(/\/$/, '') + (str.startsWith('/') ? str : `/${str}`)
}

export const createClient = (config: ClientConfig = {}): FetchClient => {
  const _fetch = config.fetch ?? globalThis.fetch
  const interceptors = createInterceptors<Request, Response, unknown, Request>()

  const execute = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const url = resolveUrl(config.baseUrl, input)
    const headers = mergeHeaders(config.headers, input instanceof Request ? input.headers : undefined, init?.headers)
    const baseInit = input instanceof Request ? { method: input.method } : {}

    let request = new Request(url, { ...baseInit, ...init, headers })

    for (const fn of interceptors.request.fns) {
      if (fn) request = await fn(request, request)
    }

    let response: Response
    try {
      response = await _fetch(request)
    }
    catch (error) {
      let finalError: unknown = error
      for (const fn of interceptors.error.fns) {
        if (fn) finalError = await fn(error, undefined as any, request, request)
      }
      throw finalError
    }

    for (const fn of interceptors.response.fns) {
      if (fn) response = await fn(response, request, request)
    }

    return response
  }

  const method = (verb: string) => (input: string | URL, init?: RequestInit) =>
    execute(input, { ...init, method: verb })

  return {
    interceptors,
    fetch: execute,
    get: method('GET'),
    post: method('POST'),
    put: method('PUT'),
    patch: method('PATCH'),
    delete: method('DELETE'),
    head: method('HEAD'),
    options: method('OPTIONS'),
  }
}
