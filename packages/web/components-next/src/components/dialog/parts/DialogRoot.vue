<script setup lang="ts">
import { DialogRoot as RekaDialogRoot } from 'reka-ui'
import {
  computed,
  watch,
} from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import { getCustomComponentVariant } from '@/class-variant/customClassVariants'
import { useProvideDialogContext } from '@/components/dialog/dialog.context'
import type { DialogProps } from '@/components/dialog/dialog.props'
import type { CreateDialogStyle } from '@/components/dialog/dialog.style'
import { createDialogStyle } from '@/components/dialog/dialog.style'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<DialogProps>(), {
  id: null,
  teleportTargetId: null,
  testId: null,
  classConfig: null,
  hideOverlay: false,
  mode: 'overlay',
  preventClickOutside: false,
  preventEsc: false,
  variant: null,
})

const emit = defineEmits<{
  close: []
}>()

defineSlots<{
  /**
   * Slot for the dialog components.
   */
  default: () => void
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
})

const {
  theme,
} = injectThemeProviderContext()

const dialogStyle = computed<CreateDialogStyle>(() => createDialogStyle({
  variant: props.variant ?? undefined,
}))

const customClassConfig = computed<ResolvedClassConfig<'dialog'>>(
  () => getCustomComponentVariant('dialog', theme.value, {
    variant: props.variant,
  }),
)

watch(isOpen, (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
})

useProvideDialogContext({
  ...toComputedRefs(props),
  isOpen: computed<boolean>(() => isOpen.value),
  customClassConfig,
  style: dialogStyle,
})
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <RekaDialogRoot
      v-model:open="isOpen"
      :modal="!props.hideOverlay"
    >
      <slot />
    </RekaDialogRoot>
  </TestIdProvider>
</template>
