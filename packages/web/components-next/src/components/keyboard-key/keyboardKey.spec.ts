import { mount } from '@vue/test-utils'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type { KeyboardKeyProps } from '@/components/keyboard-key/keyboardKey.props'
import KeyboardKeyComponent from '@/components/keyboard-key/KeyboardKey.vue'
import type { KeyboardKey } from '@/types/keyboard.type'

let userAgentSpy: ReturnType<typeof vi.spyOn>

function mountComponent(props: KeyboardKeyProps): ReturnType<typeof mount> {
  return mount(KeyboardKeyComponent, {
    props,
  })
}

function setupOsMocks(isWindowsEnvironment: boolean): void {
  const userAgent = isWindowsEnvironment ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'

  if (userAgentSpy) {
    userAgentSpy.mockRestore()
  }

  userAgentSpy = vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
}

describe('keyboardKey.vue (Basic Functionality)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (userAgentSpy) {
      userAgentSpy.mockRestore()
    }
  })

  it('renders a <kbd> element', () => {
    setupOsMocks(false)

    const wrapper = mountComponent({
      keyboardKey: 'a',
    })

    expect(wrapper.find('kbd').exists()).toBeTruthy()
  })

  describe('oS Specific Key Display', () => {
    const windowsTestCases: { expected: string
      input: KeyboardKey }[] = [
      {
        expected: 'Alt',
        input: 'alt',
      },
      {
        expected: 'Ctrl',
        input: 'ctrl',
      },
      {
        expected: 'Win',
        input: 'meta',
      },
      {
        expected: 'Enter',
        input: 'enter',
      },
      {
        expected: 'Backspace',
        input: 'backspace',
      },
      {
        expected: 'Shift',
        input: 'shift',
      },
      {
        expected: 'Esc',
        input: 'escape',
      },
      {
        expected: '↑',
        input: 'arrowup',
      },
      {
        expected: 'a',
        input: 'a',
      },
      {
        expected: 'tab',
        input: 'tab',
      },
    ]

    it.each(windowsTestCases)(`displays "$expected" for key "$input" on Windows`, ({
      expected, input,
    }) => {
      setupOsMocks(true)

      const wrapper = mountComponent({
        keyboardKey: input,
      })

      expect(wrapper.text()).toBe(expected)
    })

    const macTestCases: { expected: string
      input: KeyboardKey }[] = [
      {
        expected: '⌥',
        input: 'alt',
      },
      {
        expected: '⌃',
        input: 'ctrl',
      },
      {
        expected: '⌘',
        input: 'meta',
      },
      {
        expected: '↵',
        input: 'enter',
      },
      {
        expected: '⌫',
        input: 'backspace',
      },
      {
        expected: '⇧',
        input: 'shift',
      },
      {
        expected: 'ESC',
        input: 'escape',
      },
      {
        expected: '←',
        input: 'arrowleft',
      },
      {
        expected: 'b',
        input: 'b',
      },
      {
        expected: 'v',
        input: 'v',
      },
    ]

    it.each(macTestCases)(`displays "$expected" for key "$input" on Mac/Non-Windows`, ({
      expected, input,
    }) => {
      setupOsMocks(false)

      const wrapper = mountComponent({
        keyboardKey: input,
      })

      expect(wrapper.text()).toBe(expected)
    })
  })
})
