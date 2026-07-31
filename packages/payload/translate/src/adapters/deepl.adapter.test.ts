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
    vi.unstubAllGlobals()
  })

  it('limits simultaneous DeepL requests to 25', async () => {
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
    const translations = Array.from(
      {
        length: 26,
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

    expect(fetchMock).toHaveBeenCalledTimes(25)

    const initialResponses = deferredResponses.splice(0, 25)

    for (const [
      index,
      response,
    ] of initialResponses.entries()) {
      response.resolve(createTranslationResponse(`Vertaling ${index}`))
    }

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(26)
    })

    deferredResponses[0]?.resolve(createTranslationResponse('Vertaling 25'))

    await expect(Promise.all(translations)).resolves.toEqual(
      Array.from(
        {
          length: 26,
        },
        (_, index) => `Vertaling ${index}`,
      ),
    )
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
