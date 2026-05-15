import { mount } from '@vue/test-utils'
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { defineComponent } from 'vue'

import { usePdfObjectUrl } from './pdfObjectUrl.composable'

describe('usePdfObjectUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates and revokes object URLs', () => {
    const firstBlob = new Blob(['first'], { type: 'application/pdf' })
    const secondBlob = new Blob(['second'], { type: 'application/pdf' })
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL')
      .mockReturnValueOnce('blob:first')
      .mockReturnValueOnce('blob:second')
    const revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const component = defineComponent({
      setup() {
        return usePdfObjectUrl()
      },
      template: '<div />',
    })

    const wrapper = mount(component)

    expect(wrapper.vm.setBlob(firstBlob)).toBe('blob:first')
    expect(wrapper.vm.url).toBe('blob:first')

    expect(wrapper.vm.setBlob(secondBlob)).toBe('blob:second')
    expect(wrapper.vm.url).toBe('blob:second')
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:first')

    wrapper.unmount()

    expect(createObjectUrlSpy).toHaveBeenCalledTimes(2)
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:second')
  })
})
