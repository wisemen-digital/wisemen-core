import { mount } from '@vue/test-utils'
import {
  describe,
  expect,
  it,
} from 'vitest'

import PdfDocument from './PdfDocument.vue'

describe('PdfDocument', () => {
  it('renders the default slot and page CSS variables', () => {
    const wrapper = mount(PdfDocument, {
      props: {
        format: 'a4',
        pageGap: '12mm',
      },
      slots: {
        default: 'PDF content',
      },
    })

    expect(wrapper.text()).toContain('PDF content')
    expect(wrapper.attributes('style')).toContain('--pdf-page-height: 297mm')
    expect(wrapper.attributes('style')).toContain('--pdf-page-width: 210mm')
    expect(wrapper.attributes('style')).toContain('--pdf-page-gap: 12mm')
  })

  it('supports landscape orientation', () => {
    const wrapper = mount(PdfDocument, {
      props: {
        format: 'a4',
        orientation: 'landscape',
      },
    })

    expect(wrapper.attributes('style')).toContain('--pdf-page-height: 210mm')
    expect(wrapper.attributes('style')).toContain('--pdf-page-width: 297mm')
  })
})
