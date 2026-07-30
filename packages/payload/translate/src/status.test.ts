import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  canTranslateStatus,
  TRANSLATION_STATUSES,
} from '#status.ts'

describe('canTranslateStatus', () => {
  it.each([
    [
      TRANSLATION_STATUSES.notTranslated,
      true,
    ],
    [
      TRANSLATION_STATUSES.staleTranslation,
      true,
    ],
    [
      TRANSLATION_STATUSES.translated,
      false,
    ],
    [
      TRANSLATION_STATUSES.manuallyEdited,
      false,
    ],
  ])('returns %s for %s', (status, expected) => {
    expect(canTranslateStatus(status)).toBe(expected)
  })
})
