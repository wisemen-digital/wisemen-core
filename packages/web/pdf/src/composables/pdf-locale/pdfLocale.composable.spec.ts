import { mount } from '@vue/test-utils'
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { defineComponent } from 'vue'

import { usePdfLocale } from './pdfLocale.composable'

describe('usePdfLocale', () => {
  it('applies the configured locale on mount and restores the previous locale on unmount', () => {
    let currentLocale = 'nl'
    const setLocale = vi.fn((locale: string) => {
      currentLocale = locale
    })
    const component = defineComponent({
      setup() {
        return usePdfLocale({
          getCurrentLocale: () => currentLocale,
          locale: 'fr',
          setLocale,
        })
      },
      template: '<div />',
    })

    const wrapper = mount(component)

    expect(setLocale).toHaveBeenCalledWith('fr')
    expect(currentLocale).toBe('fr')

    wrapper.unmount()

    expect(setLocale).toHaveBeenLastCalledWith('nl')
    expect(currentLocale).toBe('nl')
  })

  it('uses the fallback locale when no PDF locale is configured', () => {
    const setLocale = vi.fn()
    const component = defineComponent({
      setup() {
        return usePdfLocale({
          fallbackLocale: 'en',
          getCurrentLocale: () => 'nl',
          locale: null,
          setLocale,
        })
      },
      template: '<div />',
    })

    const wrapper = mount(component)

    expect(setLocale).not.toHaveBeenCalled()

    wrapper.unmount()

    expect(setLocale).toHaveBeenCalledWith('en')
  })
})
