import { mount } from '@vue/test-utils'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { VcTextarea as Textarea } from '@/components/textarea'

describe('textarea Component', () => {
  it('renders with default props', () => {
    const wrapper = mount(Textarea, {
      props: {
        label: 'Test Label',
        modelValue: '',
      },
    })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('textarea').exists()).toBeTruthy()
    expect(wrapper.text()).toContain('Test Label')
  })

  it('binds modelValue and emits update:modelValue', async () => {
    const wrapper = mount(Textarea, {
      props: {
        label: 'Test',
        modelValue: '',
      },
    })
    const textarea = wrapper.find('textarea')

    await textarea.setValue('hello')
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue']![0]).toEqual([
      'hello',
    ])
  })

  it('renders label slot content', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: '',
      },
      slots: {
        bottom: [],
        default: [],
        error: [],
        hint: [],
        label: '<span class="custom-label">Custom Label</span>',
        top: [],
      },
    })

    expect(wrapper.find('.custom-label').exists()).toBeTruthy()
  })

  it('renders error props', () => {
    const wrapper = mount(Textarea, {
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
    const wrapper = mount(Textarea, {
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
    const wrapper = mount(Textarea, {
      props: {
        label: 'Test',
        modelValue: '',
      },
      slots: {
        bottom: [],
        default: [],
        error: '<span class="custom-error">Custom Error</span>',
        hint: '<span class="custom-hint">Custom Hint</span>',
        label: [],
        top: [],
      },
    })

    expect(wrapper.find('.custom-error').exists()).toBeTruthy()
    expect(wrapper.find('.custom-hint').exists()).toBeTruthy()
  })

  it('applies required state', () => {
    const wrapper = mount(Textarea, {
      props: {
        isRequired: true,
        label: 'Test',
        modelValue: '',
      },
    })

    expect(wrapper.text()).toContain('*')
  })

  it('emits blur and focus events', async () => {
    const wrapper = mount(Textarea, {
      props: {
        label: 'Test',
        modelValue: '',
      },
    })
    const textarea = wrapper.find('textarea')

    await textarea.trigger('focus')
    await textarea.trigger('blur')
    expect(wrapper.emitted().focus).toBeTruthy()
    expect(wrapper.emitted().blur).toBeTruthy()
  })

  it('uses custom id if provided', () => {
    const wrapper = mount(Textarea, {
      props: {
        id: 'custom-id',
        label: 'Test',
        modelValue: '',
      },
    })

    expect(wrapper.find('textarea').attributes('id')).toBe('custom-id')
  })

  it('renders top and bottom slots', () => {
    const wrapper = mount(Textarea, {
      props: {
        label: 'Test',
        modelValue: '',
      },
      slots: {
        bottom: '<span class="bottom-slot">Bottom</span>',
        default: [],
        error: [],
        hint: [],
        label: [],
        top: '<span class="top-slot">Top</span>',
      },
    })

    expect(wrapper.find('.top-slot').exists()).toBeTruthy()
    expect(wrapper.find('.bottom-slot').exists()).toBeTruthy()
  })

  it('disables textarea when disabled prop is true', () => {
    const wrapper = mount(Textarea, {
      props: {
        isDisabled: true,
        label: 'Test',
        modelValue: '',
      },
    })

    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
  })
})
