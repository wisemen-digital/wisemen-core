/* eslint-disable regexp/no-useless-quantifier */
/* eslint-disable regexp/no-super-linear-backtracking */
import {
  useActiveElement,
  useDebounceFn,
  useEventListener,
} from '@vueuse/core'
import type { MaybeRef } from 'vue'
import {
  computed,
  ref,
  toValue,
} from 'vue'

import { useKbd } from '@/composables/kbd.composable'

type Handler = (e?: any) => void

const CHAINED_SHORTCUT_REGEX = /^[^-]+.*-.*[^-]+$/
const COMBINED_SHORTCUT_REGEX = /^[^_]+.*_.*[^_]+$/
const LETTER_REGEX = /^[a-z]$/i
const DIGIT_REGEX = /^\d$/
const FUNCTION_KEY_REGEX = /^f\d+$/i
const ALPHABET_KEY_CODE_REGEX = /^Key[A-Z]$/i
const ALPHABET_KEY_REGEX = /^[a-z]{1}$/i

export interface ShortcutConfig {
  handler: Handler
  usingInput?: boolean | string
}

export interface ShortcutsConfig {
  [key: string]: false | Handler | ShortcutConfig | null | undefined
}

export interface ShortcutsOptions {
  chainDelay?: number
  layoutIndependent?: boolean
}

interface Shortcut {
  altKey: boolean
  chained: boolean
  ctrlKey: boolean
  enabled: boolean
  handler: Handler
  // KeyboardEvent attributes
  key: string
  metaKey: boolean
  shiftKey: boolean
  // code?: string
  // keyCode?: number
}

// keyboard keys which can be combined with Shift modifier (in addition to alphabet keys)
const shiftableKeys = [
  'arrowleft',
  'arrowright',
  'arrowup',
  'arrowright',
  'tab',
  'escape',
  'enter',
  'backspace',
]

// Simple key to code conversion for layout independence
function convertKeyToCode(key: string): string {
  // Handle single letters
  if (LETTER_REGEX.test(key)) {
    return `Key${key.toUpperCase()}`
  }
  // Handle digits
  if (DIGIT_REGEX.test(key)) {
    return `Digit${key}`
  }
  // Handle function keys
  if (FUNCTION_KEY_REGEX.test(key)) {
    return key.toUpperCase()
  }
  // Handle common special keys
  const specialKeys: Record<string, string> = {
    arrowdown: 'ArrowDown',
    arrowleft: 'ArrowLeft',
    arrowright: 'ArrowRight',
    arrowup: 'ArrowUp',
    backspace: 'Backspace',
    delete: 'Delete',
    enter: 'Enter',
    escape: 'Escape',
    space: 'Space',
    tab: 'Tab',
  }

  return specialKeys[key.toLowerCase()] || key
}

export function useKeyboardShortcut(config: MaybeRef<ShortcutsConfig>, options: ShortcutsOptions = {}) {
  const chainedInputs = ref<string[]>([])

  function clearChainedInput(): void {
    chainedInputs.value.splice(0, chainedInputs.value.length)
  }

  const debouncedClearChainedInput = useDebounceFn(clearChainedInput, options.chainDelay ?? 800)

  const {
    IS_MACOS,
  } = useKbd()

  const activeElement = useActiveElement()
  const layoutIndependent = options.layoutIndependent ?? false

  // precompute shiftable codes if layoutIndependent
  const shiftableCodes = new Set(shiftableKeys.map((k) => convertKeyToCode(k)))

  const isUsingInput = computed<boolean>(() => {
    const tagName = activeElement.value?.tagName
    const contentEditable = activeElement.value?.contentEditable

    const usingInput = Boolean(tagName === 'INPUT' || tagName === 'TEXTAREA' || contentEditable === 'true' || contentEditable === 'plaintext-only')

    return usingInput
  })

  // Map config to full detailed shortcuts
  const shortcuts = computed<Shortcut[]>(() => {
    return Object.entries(toValue(config)).map(([
      key,
      shortcutConfig,
    ]) => {
      if (!shortcutConfig) {
        return null
      }

      // Parse key and modifiers
      let shortcut: Partial<Shortcut>

      if (key.includes('-') && key !== '-' && !key.includes('_') && !key.match(CHAINED_SHORTCUT_REGEX)?.length) {
        console.warn(`[Shortcut] Invalid key: "${key}"`)
      }

      if (key.includes('_') && key !== '_' && !key.match(COMBINED_SHORTCUT_REGEX)?.length) {
        console.warn(`[Shortcut] Invalid key: "${key}"`)
      }

      const chained = key.includes('-') && key !== '-' && !key.includes('_')

      if (chained) {
        // convert each part to code if layoutIndependent, otherwise keep raw key
        if (layoutIndependent) {
          const parts = key.split('-').map((p) => convertKeyToCode(p))

          shortcut = {
            altKey: false,
            ctrlKey: false,
            key: parts.join('-'),
            metaKey: false,
            shiftKey: false,
          }
        }
        else {
          shortcut = {
            altKey: false,
            ctrlKey: false,
            key: key.toLowerCase(),
            metaKey: false,
            shiftKey: false,
          }
        }
      }
      else {
        const keySplit = key.toLowerCase().split('_').map((k) => k)
        let baseKey = keySplit.filter((k) => ![
          'meta',
          'command',
          'ctrl',
          'shift',
          'alt',
          'option',
        ].includes(k)).join('_')

        if (layoutIndependent) {
          baseKey = convertKeyToCode(baseKey)
        }

        shortcut = {
          altKey: keySplit.includes('alt') || keySplit.includes('option'),
          ctrlKey: keySplit.includes('ctrl'),
          key: baseKey,
          metaKey: keySplit.includes('meta') || keySplit.includes('command'),
          shiftKey: keySplit.includes('shift'),
        }
      }

      shortcut.chained = chained

      // Convert Meta to Ctrl for non-MacOS
      if (!IS_MACOS && shortcut.metaKey && !shortcut.ctrlKey) {
        shortcut.metaKey = false
        shortcut.ctrlKey = true
      }

      // Retrieve handler function
      if (typeof shortcutConfig === 'function') {
        shortcut.handler = shortcutConfig
      }
      else if (typeof shortcutConfig === 'object') {
        shortcut = {
          ...shortcut,
          handler: shortcutConfig.handler,
        }
      }

      if (!shortcut.handler) {
        console.warn('[Shortcut] Invalid value')

        return null
      }

      let enabled = true

      const firstKeyPart = key.split(chained ? '-' : '_')[0]
      const firstKeyPartIsMeta = firstKeyPart === 'meta' || firstKeyPart === 'command'

      if (!firstKeyPartIsMeta) {
        if (!(shortcutConfig as ShortcutConfig).usingInput) {
          enabled = !isUsingInput.value
        }
        else if (typeof (shortcutConfig as ShortcutConfig).usingInput === 'string') {
          enabled = isUsingInput.value === (shortcutConfig as ShortcutConfig).usingInput
        }
      }

      shortcut.enabled = enabled

      return shortcut
    }).filter(Boolean) as Shortcut[]
  })

  function onKeyDown(e: KeyboardEvent): void {
    // Input autocomplete triggers a keydown event
    if (!e.key) {
      return
    }

    const alphabetKey = layoutIndependent ? ALPHABET_KEY_CODE_REGEX.test(e.code) : ALPHABET_KEY_REGEX.test(e.key)
    const shiftableKey = layoutIndependent ? shiftableCodes.has(e.code) : shiftableKeys.includes(e.key.toLowerCase())

    let chainedKey

    // push either code or key depending on layoutIndependent flag
    chainedInputs.value.push(layoutIndependent ? e.code : e.key)

    // try matching a chained shortcut
    if (chainedInputs.value.length >= 2) {
      chainedKey = chainedInputs.value.slice(-2).join('-')

      for (const shortcut of shortcuts.value.filter((s) => s.chained)) {
        if (shortcut.key !== chainedKey) {
          continue
        }

        if (shortcut.enabled) {
          shortcut.handler(e)
        }

        clearChainedInput()

        return
      }
    }

    // try matching a standard shortcut
    for (const shortcut of shortcuts.value.filter((s) => !s.chained)) {
      if (layoutIndependent) {
        // compare by code
        if (e.code !== shortcut.key) {
          continue
        }
      }
      else {
        if (e.key.toLowerCase() !== shortcut.key) {
          continue
        }
      }

      if (e.metaKey !== shortcut.metaKey) {
        continue
      }
      if (e.ctrlKey !== shortcut.ctrlKey) {
        continue
      }
      // shift modifier is only checked in combination with alphabet keys and some extra keys
      // (shift with special characters would change the key)
      if ((alphabetKey || shiftableKey) && e.shiftKey !== shortcut.shiftKey) {
        continue
      }

      if (shortcut.enabled) {
        shortcut.handler(e)
      }

      clearChainedInput()

      return
    }

    debouncedClearChainedInput()
  }

  return useEventListener('keydown', onKeyDown)
}
