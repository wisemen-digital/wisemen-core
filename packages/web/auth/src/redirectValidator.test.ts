import {
  describe,
  expect,
  it,
} from 'vitest'

import { RedirectValidator } from './redirectValidator'

describe('redirectValidator', () => {
  it('rejects protocol-relative redirect targets', () => {
    const validator = new RedirectValidator({})

    expect(validator.isValidRedirectUrl('//evil.example.com')).toBe(false)
  })

  it('blocks auth routes even when the redirect includes query params', () => {
    const validator = new RedirectValidator({
      blockedPaths: [
        '/auth/*',
      ],
    })

    expect(validator.isValidRedirectUrl('/auth/login?redirectUrl=%2Fdashboard')).toBe(false)
  })

  it('accepts query strings on exact allowed paths', () => {
    const validator = new RedirectValidator({
      allowedPaths: [
        '/dashboard',
      ],
    })

    expect(validator.isValidRedirectUrl('/dashboard?tab=team')).toBe(true)
  })

  it('falls back to the default root when the provided fallback is unsafe', () => {
    const validator = new RedirectValidator({})

    expect(validator.sanitizeRedirectUrl('//evil.example.com', '//other.example.com')).toBe('/')
  })
})
