import {
  beforeEach,
  vi,
} from 'vitest'
import type { Composer } from 'vue-i18n'

import { initializeZodValidationConfig } from '#/config/config.js'

beforeEach(() => {
  const mockI18n: Partial<Composer> = {
    t: vi.fn((key: string) => key),
  }

  initializeZodValidationConfig({
    i18nInstance: mockI18n as Composer,
  })
})
