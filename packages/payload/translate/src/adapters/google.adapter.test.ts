import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { GoogleTranslateAdapter } from './google.adapter.ts'

describe('the Google translation adapter', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('retries a rate-limited fallback request after the retry delay', async () => {
    vi.useFakeTimers()

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(createErrorResponse(429, '1'))
      .mockResolvedValueOnce(createTranslationResponse('Translation'))

    vi.stubGlobal('fetch', fetchMock)

    const adapter = new GoogleTranslateAdapter({
      fallbackApiURL: 'https://example.test/google-retry',
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

    await vi.advanceTimersByTimeAsync(1500)

    await expect(translation).resolves.toBe('Translation')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})

function createTranslationResponse(text: string): Response {
  return {
    json: () => Promise.resolve({
      sentences: [
        {
          trans: text,
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
