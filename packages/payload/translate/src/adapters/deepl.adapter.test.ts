import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { DeepLTranslateAdapter } from './deepl.adapter.ts'

interface DeferredResponse {
  resolve: (value: Response) => void
}

describe('the DeepL translation adapter', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('batches compatible DeepL requests into one API call', async () => {
    vi.useFakeTimers()

    const deferredResponses: DeferredResponse[] = []
    const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(() =>
      new Promise<Response>((resolve) => {
        deferredResponses.push({
          resolve,
        })
      }))

    vi.stubGlobal('fetch', fetchMock)

    const adapter = new DeepLTranslateAdapter({
      apiKey: 'test-key',
    })
    const translations = Array.from(
      {
        length: 6,
      },
      (_, index) => adapter.translate(
        {
          document: {},
          req: {} as never,
          sourceLocale: 'en',
          targetLocale: 'nl',
          text: `Text ${index}`,
        },
      ),
    )

    await vi.advanceTimersByTimeAsync(0)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)).toMatchObject({
      text: Array.from(
        {
          length: 6,
        },
        (_, index) => `Text ${index}`,
      ),
    })

    const deferredResponse = deferredResponses.shift()

    expect(deferredResponse).toBeDefined()
    deferredResponse?.resolve(createTranslationResponse(
      Array.from(
        {
          length: 6,
        },
        (_, index) => `Vertaling ${index}`,
      ),
    ))

    await expect(Promise.all(translations)).resolves.toEqual(
      Array.from(
        {
          length: 6,
        },
        (_, index) => `Vertaling ${index}`,
      ),
    )
  })

  it('retries rate-limited requests after the retry delay', async () => {
    vi.useFakeTimers()

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(createErrorResponse(429, '1'))
      .mockResolvedValueOnce(createTranslationResponse('Vertaling'))

    vi.stubGlobal('fetch', fetchMock)

    const adapter = new DeepLTranslateAdapter({
      apiKey: 'retry-test-key',
    })
    const translation = adapter.translate({
      document: {},
      req: {} as never,
      sourceLocale: 'en',
      targetLocale: 'nl',
      text: 'Text',
    })

    await vi.advanceTimersByTimeAsync(0)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(1000)

    await expect(translation).resolves.toBe('Vertaling')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})

function createTranslationResponse(text: string | string[]): Response {
  return {
    json: () => Promise.resolve({
      translations: (Array.isArray(text)
        ? text
        : [
            text,
          ]).map((translation) => ({
        text: translation,
      })),
    }),
    ok: true,
  } as Response
}

function createErrorResponse(status: number, retryAfter?: string): Response {
  return {
    headers: new Headers(retryAfter
      ? {
          'retry-after': retryAfter,
        }
      : undefined),
    ok: false,
    status,
    text: () => Promise.resolve('Too many requests'),
  } as Response
}
