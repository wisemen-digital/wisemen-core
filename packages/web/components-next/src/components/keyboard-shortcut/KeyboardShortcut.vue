<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClassConfigs,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useInjectConfigContext } from '@/components/config-provider/config.context'
import KeyboardKey from '@/components/keyboard-key/KeyboardKey.vue'
import type { KeyboardShortcutProps } from '@/components/keyboard-shortcut/keyboardShortcut.props'
import type { CreateKeyboardShortcutStyle } from '@/components/keyboard-shortcut/keyboardShortcut.style'
import { createKeyboardShortcutStyle } from '@/components/keyboard-shortcut/keyboardShortcut.style'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import type { KeyboardKey as KeyboardKeyType } from '@/types/keyboard.type'
import { isMobileDevice } from '@/utils/device.util'

const props = withDefaults(defineProps<KeyboardShortcutProps>(), {
  classConfig: null,
})

const {
  areKeyboardShortcutHintsHidden,
} = useInjectConfigContext()
const {
  theme,
} = injectThemeProviderContext()

const {
  t,
} = useI18n()

function isModifier(key: KeyboardKeyType): boolean {
  return key === 'ctrl' || key === 'shift' || key === 'alt' || key === 'meta'
}

const isSequence = computed<boolean>(() => {
  return !props.keyboardKeys.some((keyboardKey) => isModifier(keyboardKey))
})

const keyboardShortcutStyle = computed<CreateKeyboardShortcutStyle>(
  () => createKeyboardShortcutStyle(),
)

const customClassConfig = computed<ResolvedClassConfig<'keyboardShortcut'>>(
  () => getCustomComponentVariant('keyboardShortcut', theme.value, {
    variant: props.variant,
  }),
)
</script>

<template>
  <div
    v-if="!areKeyboardShortcutHintsHidden && !isMobileDevice()"
    :class="keyboardShortcutStyle.root({
      class: mergeClasses(customClassConfig.root, props.classConfig?.root),
    })"
  >
    <template
      v-for="(keyboardKey, index) of keyboardKeys"
      :key="index"
    >
      <KeyboardKey
        :keyboard-key="keyboardKey"
        :class-config="mergeClassConfigs(
          customClassConfig.keyboardKey,
          props.classConfig?.keyboardKey,
        )"
      />

      <template v-if="index < props.keyboardKeys.length - 1 && isSequence">
        <span
          :class="keyboardShortcutStyle.thenLabel({
            class: mergeClasses(customClassConfig.thenLabel, props.classConfig?.thenLabel),
          })"
        >
          {{ t('component.keyboard_shortcut.then') }}
        </span>
      </template>
    </template>
  </div>
</template>
