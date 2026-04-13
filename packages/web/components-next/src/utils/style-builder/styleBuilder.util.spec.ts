import {
  describe,
  expect,
  it,
} from 'vitest'

import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

describe('styleBuilder', () => {
  it('should be defined', () => {
    const styleBuilder = new StyleBuilder()

    expect(styleBuilder).toBeDefined()
  })
})
