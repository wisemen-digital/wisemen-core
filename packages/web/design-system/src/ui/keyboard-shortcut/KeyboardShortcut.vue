<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useKbd } from '@/composables/kbd.composable'
import type { KeyboardShortcutProps } from '@/ui/keyboard-shortcut/keyboardShortcut.props'
import { UIRowLayout } from '@/ui/row-layout/index'

interface CombinationSeparatorPart {
  part: 'separator'
  type: 'combination'
}

interface SequenceSeparatorPart {
  part: 'separator'
  type: 'sequence'
}

interface KeyPart {
  part: 'key'
  value: string
}

type ShortcutPart = CombinationSeparatorPart | KeyPart | SequenceSeparatorPart

const props = defineProps<KeyboardShortcutProps>()

const COMBINATION_SEPARATOR = '_' // meta_k
const SEQUENCE_SEPARATOR = '-' // g-d

const i18n = useI18n()
const kbd = useKbd()

const shortcutParts = computed<ShortcutPart[]>(() => {
  const parts: ShortcutPart[] = []
  const sequenceParts = props.keyboardShortcut.split(SEQUENCE_SEPARATOR)

  for (const [
    sequenceIndex,
    sequencePart,
  ] of sequenceParts.entries()) {
    const combinationParts = sequencePart.split(COMBINATION_SEPARATOR)

    for (const [
      combinationIndex,
      combinationPart,
    ] of combinationParts.entries()) {
      parts.push({
        part: 'key',
        value: kbd.getKbdKey(combinationPart.trim()),
      })

      if (combinationIndex < combinationParts.length - 1) {
        parts.push({
          part: 'separator',
          type: 'combination',
        })
      }
    }

    if (sequenceIndex < sequenceParts.length - 1) {
      parts.push({
        part: 'separator',
        type: 'sequence',
      })
    }
  }

  return parts
})
</script>

<template>
  <UIRowLayout gap="xs">
    <template
      v-for="(part, partIndex) of shortcutParts"
      :key="partIndex"
    >
      <kbd
        v-if="part.part === 'key'"
        class="
          flex h-4 min-w-4 items-center justify-center rounded-xs border
          border-secondary px-xxs text-center font-sans text-[0.6187rem]
          text-tertiary capitalize
          dark:bg-secondary
        "
      >
        {{ part.value }}
      </kbd>

      <span
        v-else-if="part.type === 'sequence'"
        class="text-xxs text-tertiary"
      >
        {{ i18n.t('component.keyboard_shortcut.sequence_label') }}
      </span>
    </template>
  </UIRowLayout>
</template>
