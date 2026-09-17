import {
  describe,
  expect,
  it,
} from 'vitest'

import { getBackendErrorCodes } from './plugin'

describe('getBackendErrorCodes', () => {
  it('collects each unique code from 4xx and 5xx backend error schemas', () => {
    const codes = getBackendErrorCodes([
      {
        properties: {
          code: {
            items: [
              {
                const: 'invalid-email',
              },
              {
                const: 'email-already-used',
              },
            ],
          },
          status: {
            items: [
              {
                const: '400',
              },
            ],
          },
        },
      },
      {
        properties: {
          code: {
            const: 'service_unavailable',
          },
          status: {
            const: '503',
          },
        },
      },
      {
        properties: {
          code: {
            const: 'ignored-success-code',
          },
          status: {
            const: '200',
          },
        },
      },
      {
        properties: {
          code: {
            const: 'invalid-email',
          },
          status: {
            const: '400',
          },
        },
      },
    ])

    expect(codes).toEqual([
      'email-already-used',
      'invalid-email',
      'service_unavailable',
    ])
  })
})
