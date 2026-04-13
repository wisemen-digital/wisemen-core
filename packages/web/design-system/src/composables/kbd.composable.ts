import { createSharedComposable } from '@vueuse/core'
import {
  onMounted,
  reactive,
} from 'vue'

interface KbdKeysSpecificMap {
  alt: string
  ctrl: string
  meta: string
}

export const kbdKeysMap = {
  alt: '',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  arrowup: '↑',
  backspace: '⌫',
  capslock: '⇪',
  command: '⌘',
  control: '⌃',
  ctrl: '',
  delete: '⌦',
  end: '↘',
  enter: '↵',
  escape: 'Esc',
  home: '↖',
  option: '⌥',
  pagedown: '⇟',
  pageup: '⇞',
  shift: '⇧',
  tab: '⇥',
  win: '⊞',
  meta: '',
}

export type KbdKey = keyof typeof kbdKeysMap
export type KbdKeySpecific = keyof KbdKeysSpecificMap

const MACINTOSH_REGEX = /Macintosh;/
const IS_MACOS = isMacos()

function isMacos(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.userAgent !== 'string') {
    return false
  }

  return MACINTOSH_REGEX.test(navigator.userAgent)
}

export const useKbd = createSharedComposable(() => {
  const kbdKeysSpecificMap = reactive<{
    alt: string
    ctrl: string
    meta: string
  }>({
    alt: ' ',
    ctrl: ' ',
    meta: ' ',
  })

  onMounted(() => {
    kbdKeysSpecificMap.meta = IS_MACOS ? kbdKeysMap.command : 'Ctrl'
    kbdKeysSpecificMap.ctrl = IS_MACOS ? kbdKeysMap.control : 'Ctrl'
    kbdKeysSpecificMap.alt = IS_MACOS ? kbdKeysMap.option : 'Alt'
  })

  function getKbdKey(value: string | KbdKey): string {
    if ([
      'meta',
      'alt',
      'ctrl',
    ].includes(value)) {
      return kbdKeysSpecificMap[value as KbdKeySpecific]
    }

    return kbdKeysMap[value as KbdKey] || value
  }

  return {
    getKbdKey,
    IS_MACOS,
  }
})
