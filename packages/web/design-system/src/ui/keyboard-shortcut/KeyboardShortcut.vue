<script setup lang="ts">
import type {
  IndividualKey,
  RegisterableHotkey,
} from '@tanstack/vue-hotkeys'
import {
  detectPlatform,
  formatForDisplay,
  normalizeRegisterableHotkey,
  resolveModifier,
} from '@tanstack/vue-hotkeys'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type {
  KeyboardShortcut,
  KeyboardShortcutKeyPart,
  KeyboardShortcutPart,
} from '@/ui/keyboard-shortcut/keyboardShortcut.type'
import KeyboardShortcutKey from '@/ui/keyboard-shortcut/KeyboardShortcutKey.vue'
import { UIRowLayout } from '@/ui/row-layout'

const props = withDefaults(defineProps<{
  enableKeyHoldVisualization?: boolean
  keyboardShortcut: KeyboardShortcut
}>(), {
  enableKeyHoldVisualization: false,
})

const i18n = useI18n()

// Resolve platform once — detectPlatform() reads navigator.userAgent synchronously
const platform = detectPlatform()

// Use a unique separator so we can split individual key labels out of the
// formatForDisplay result without risking collision with key names.
const PART_SEPARATOR = '\x00'

function buildKeyParts(step: RegisterableHotkey): KeyboardShortcutKeyPart[] {
  const rawKeys = normalizeRegisterableHotkey(step, platform).split('+')
  const displayValues = formatForDisplay(step, {
    platform,
    separatorToken: PART_SEPARATOR,
  }).split(PART_SEPARATOR)

  return rawKeys.map((rawKey, i) => ({
    part: 'key' as const,
    rawKey: (rawKey === 'Mod' ? resolveModifier('Mod', platform) : rawKey) as IndividualKey,
    value: (displayValues[i] ?? rawKey),
  }))
}

const shortcutParts = computed<KeyboardShortcutPart[]>(() => {
  const sc = props.keyboardShortcut

  if ('sequence' in sc) {
    const parts: KeyboardShortcutPart[] = []

    for (const [
      index,
      step,
    ] of sc.sequence.entries()) {
      parts.push(...buildKeyParts(step))

      if (index < sc.sequence.length - 1) {
        parts.push({
          part: 'separator',
        })
      }
    }

    return parts
  }

  return buildKeyParts(sc)
})
</script>

<template>
  <UIRowLayout gap="xs">
    <template
      v-for="(part, partIndex) of shortcutParts"
      :key="partIndex"
    >
      <KeyboardShortcutKey
        v-if="part.part === 'key'"
        :keyboard-key="part.value"
        :raw-key="part.rawKey"
        :enable-key-hold-visualization="props.enableKeyHoldVisualization"
      />

      <span
        v-else
        class="text-xxs text-tertiary"
      >
        {{ i18n.t('component.keyboard_shortcut.then') }}
      </span>
    </template>
  </UIRowLayout>
</template>
