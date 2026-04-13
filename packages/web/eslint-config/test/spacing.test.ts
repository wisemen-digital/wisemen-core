/* eslint-disable unicorn/consistent-function-scoping */
import {
  assert,
  describe,
  it,
} from 'vitest'

describe('spacing plugin adds correct spacing', () => {
  it('adds correct spacing between function ]and vars', () => {
    function _test(): void {}

    const _test2 = 1
    const _test3 = 2

    function _test4(): void {}

    assert(true)
  })

  it('adds correct spacing between vars and vars', () => {
    const _test = 1
    const _test2 = 2

    const _test3 = 3
    const _test4 = 4

    assert(true)
  })

  it('adds correct spacing between return and vars', () => {
    function _test(): number {
      const _test2 = 1
      const _test3 = 2

      return _test2
    }

    assert(true)
  })
})
