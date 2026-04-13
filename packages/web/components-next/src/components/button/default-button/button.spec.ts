import { mount } from '@vue/test-utils'
import {
  describe,
  expect,
  it,
} from 'vitest'

import Button from './Button.vue'

describe('button Component', () => {
  it('renders the default slot content correctly', () => {
    const buttonText = 'Submit Form'
    const wrapper = mount(Button, {
      slots: {
        'default': buttonText,
        'icon-left': () => null,
        'icon-right': () => null,
        'loader': () => null,
      },
    })

    expect(wrapper.text()).toContain(buttonText)
  })

  it('emits a click event when the button is clicked', async () => {
    const wrapper = mount(Button)

    await wrapper.trigger('click')

    expect(wrapper.emitted().click).toHaveLength(1)
  })

  it('renders custom content in the "icon-left" slot and overrides the default icon', () => {
    const customIconContent = '<span data-test-id="custom-left-icon">✨</span>'
    const wrapper = mount(Button, {
      slots: {
        'default': () => null,
        'icon-left': customIconContent,
        'icon-right': () => null,
        'loader': () => null,
      },
    })

    expect(wrapper.find('[data-test-id="custom-left-icon"]').exists()).toBeTruthy()
    expect(wrapper.text()).toContain('✨')
  })

  it('renders custom content in the "icon-right" slot and overrides the default icon', () => {
    const customIconContent = '<span data-test-id="custom-right-icon">➡️</span>'
    const wrapper = mount(Button, {
      slots: {
        'default': () => null,
        'icon-left': () => null,
        'icon-right': customIconContent,
        'loader': () => null,
      },
    })

    expect(wrapper.find('[data-test-id="custom-right-icon"]').exists()).toBeTruthy()
    expect(wrapper.text()).toContain('➡️')
  })

  it('renders the default loader when `loading` prop is true and no custom loader slot is provided', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    })

    // Expect the default ButtonLoader mock to be present without using a test id
    expect(wrapper.find('.animate-spinner').exists()).toBeTruthy()
  })

  it('renders custom content in the "loader" slot when `loading` prop is true', () => {
    const customLoaderContent = '<div data-test-id="custom-loader">Custom Loading Indicator</div>'
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      slots: {
        'default': () => null,
        'icon-left': () => null,
        'icon-right': () => null,
        'loader': customLoaderContent,
      },
    })

    // Expect the custom loader to be present
    expect(wrapper.find('[data-test-id="custom-loader"]').exists()).toBeTruthy()
    expect(wrapper.text()).toContain('Custom Loading Indicator')
  })
})
