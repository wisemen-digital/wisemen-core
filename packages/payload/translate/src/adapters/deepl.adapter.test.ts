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

  it('processes DeepL requests one at a time with a delay between requests', async () => {
    vi.useFakeTimers()

    const deferredResponses: DeferredResponse[] = []
    const fetchMock = vi.fn(() => new Promise<Response>((resolve) => {
      deferredResponses.push({
        resolve,
      })
    }))

    vi.stubGlobal('fetch', fetchMock)

    const adapter = new DeepLTranslateAdapter({
      apiKey: 'test-key',
    })
    const secondAdapter = new DeepLTranslateAdapter({
      apiKey: 'test-key',
    })
    const translations = Array.from(
      {
        length: 6,
      },
      (_, index) => (index % 2 === 0 ? adapter : secondAdapter).translate(
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

    for (let index = 0; index < 6; index += 1) {
      const deferredResponse = deferredResponses.shift()

      expect(deferredResponse).toBeDefined()
      deferredResponse?.resolve(createTranslationResponse(`Vertaling ${index}`))

      if (index < 5) {
        await vi.advanceTimersByTimeAsync(500)
      }
    }

    expect(fetchMock).toHaveBeenCalledTimes(6)

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

function createTranslationResponse(text: string): Response {
  return {
    json: () => Promise.resolve({
      translations: [
        {
          text,
        },
      ],
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
