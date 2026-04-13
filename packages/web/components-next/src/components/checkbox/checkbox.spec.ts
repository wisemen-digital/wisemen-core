import { mount } from '@vue/test-utils'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { VcCheckbox as Checkbox } from '@/components/checkbox'

describe('checkbox Component', () => {
  it('renders the checkbox input', () => {
    const wrapper = mount(Checkbox)

    expect(wrapper.find('button[role="checkbox"]').exists()).toBeTruthy()
  })

  it('accepts a checked prop', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: true,
      },
    })
    const checkboxButton = wrapper.find('button[role="checkbox"]')

    expect(checkboxButton.attributes('aria-checked')).toBe('true')
  })

  it('emits update:modelValue when clicked', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
      },
    })
    const checkboxButton = wrapper.find('button[role="checkbox"]')

    await checkboxButton.trigger('click')
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue']![0]).toEqual([
      true,
    ])
  })
})
