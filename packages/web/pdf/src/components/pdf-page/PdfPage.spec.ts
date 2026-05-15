import { mount } from '@vue/test-utils'
import {
  describe,
  expect,
  it,
} from 'vitest'

import PdfPage from './PdfPage.vue'

describe('PdfPage', () => {
  it('renders page content with format and padding CSS variables', () => {
    const wrapper = mount(PdfPage, {
      props: {
        format: 'a5',
        padding: '10mm',
      },
      slots: {
        default: 'Page content',
      },
    })

    expect(wrapper.text()).toContain('Page content')
    expect(wrapper.attributes('style')).toContain('--pdf-page-height: 210mm')
    expect(wrapper.attributes('style')).toContain('--pdf-page-width: 148mm')
    expect(wrapper.attributes('style')).toContain('--pdf-page-padding: 10mm')
  })

  it('can render without fixed page dimensions', () => {
    const wrapper = mount(PdfPage, {
      props: {
        format: null,
        padding: '8mm',
      },
    })

    expect(wrapper.attributes('style')).toBe('--pdf-page-padding: 8mm;')
  })
})
