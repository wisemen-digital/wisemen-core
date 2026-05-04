<script setup lang="ts">
import { UIIconButton } from '@/ui/button/index'
import { XCloseIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  close: []
}>()

const i18n = useI18n()
</script>

<template>
  <div
    class="
      absolute top-0 right-0 mt-md mr-sm flex h-text-sm items-center
      justify-center
    "
  >
    <UIIconButton
      :icon="XCloseIcon"
      :is-tooltip-disabled="true"
      :label="i18n.t('shared.close')"
      size="sm"
      variant="tertiary"
      @click="emit('close')"
    />
  </div>
</template>
