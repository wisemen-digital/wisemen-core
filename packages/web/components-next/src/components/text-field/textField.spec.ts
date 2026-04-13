import { mount } from '@vue/test-utils'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { VcTextField as TextField } from '@/components/text-field'

describe('textField Component', () => {
  it('renders with default props', () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Test Label',
        modelValue: '',
      },
    })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(wrapper.text()).toContain('Test Label')
  })

  it('binds modelValue and emits update:modelValue', async () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Test',
        modelValue: '',
      },
    })
    const input = wrapper.find('input')

    await input.setValue('hello')
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue']![0]).toEqual([
      'hello',
    ])
  })

  it('renders label slot content', () => {
    const wrapper = mount(TextField, {
      props: {
        modelValue: '',
      },
      slots: {
        default: [],
        error: [],
        hint: [],
        label: '<span class="custom-label">Custom Label</span>',
        left: [],
        right: [],
      },
    })

    expect(wrapper.find('.custom-label').exists()).toBeTruthy()
  })

  it('renders error props', () => {
    const wrapper = mount(TextField, {
      props: {
        isTouched: true,
        errorMessage: 'Error!',
        hint: 'Hint!',
        label: 'Test',
        modelValue: '',
      },
    })

    expect(wrapper.text()).toContain('Error!')
  })

  it('renders hint props', () => {
    const wrapper = mount(TextField, {
      props: {
        isTouched: true,
        hint: 'Hint!',
        label: 'Test',
        modelValue: '',
      },
    })

    expect(wrapper.text()).toContain('Hint!')
  })

  it('renders error and hint slots', () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Test',
        modelValue: '',
      },
      slots: {
        default: [],
        error: '<span class="custom-error">Custom Error</span>',
        hint: '<span class="custom-hint">Custom Hint</span>',
        label: [],
        left: [],
        right: [],
      },
    })

    expect(wrapper.find('.custom-error').exists()).toBeTruthy()
    expect(wrapper.find('.custom-hint').exists()).toBeTruthy()
  })

  it('applies required state', () => {
    const wrapper = mount(TextField, {
      props: {
        isRequired: true,
        label: 'Test',
        modelValue: '',
      },
    })

    expect(wrapper.text()).toContain('*')
  })

  it('emits blur and focus events', async () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Test',
        modelValue: '',
      },
    })
    const input = wrapper.find('input')

    await input.trigger('focus')
    await input.trigger('blur')
    expect(wrapper.emitted().focus).toBeTruthy()
    expect(wrapper.emitted().blur).toBeTruthy()
  })

  it('uses custom id if provided', () => {
    const wrapper = mount(TextField, {
      props: {
        id: 'custom-id',
        label: 'Test',
        modelValue: '',
      },
    })

    expect(wrapper.find('input').attributes('id')).toBe('custom-id')
  })

  it('renders left and right slots', () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Test',
        modelValue: '',
      },
      slots: {
        default: [],
        error: [],
        hint: [],
        label: [],
        left: '<span class="left-slot">Left</span>',
        right: '<span class="right-slot">Right</span>',
      },
    })

    expect(wrapper.find('.left-slot').exists()).toBeTruthy()
    expect(wrapper.find('.right-slot').exists()).toBeTruthy()
  })
})
