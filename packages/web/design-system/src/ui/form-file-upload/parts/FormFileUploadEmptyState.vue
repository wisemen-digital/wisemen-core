<script setup lang="ts">
import { Upload01Icon } from '@wisemen/vue-core-icons'
import { Motion } from 'motion-v'
import { useI18n } from 'vue-i18n'

import { UIBaseFileUploadTrigger } from '@/ui/base-file-upload'
import { UIButton } from '@/ui/button'

const props = withDefaults(defineProps<{
  id?: string | null
  isHoveringOverDropzone: boolean
  isMultiple: boolean
  description: string
  triggerAttrs?: Record<string, unknown>
}>(), {
  id: null,
  triggerAttrs: undefined,
})

const i18n = useI18n()
</script>

<template>
  <Motion
    :initial="{
      opacity: 0,
      scale: 0.98,
      filter: 'blur(4px)',
    }"
    :animate="{
      opacity: 1,
      scale: props.isHoveringOverDropzone ? 0.995 : 1,
      filter: 'blur(0px)',
    }"
    :exit="{
      opacity: 0,
      scale: 0.98,
      filter: 'blur(4px)',
    }"
    class="rounded-xl bg-secondary px-2xl py-xl"
  >
    <p class="text-sm text-primary">
      {{ i18n.t('component.form_file_upload.empty_state.title') }}
    </p>

    <p class="mt-xs text-xs text-tertiary">
      {{ props.description }}
    </p>

    <UIBaseFileUploadTrigger v-slot="{ isDisabled }">
      <UIButton
        v-bind="props.triggerAttrs"
        :id="props.isMultiple ? undefined : props.id ?? undefined"
        :icon-left="Upload01Icon"
        :is-disabled="isDisabled"
        :label="i18n.t('component.form_file_upload.action.upload')"
        class="mt-lg"
        variant="secondary"
      />
    </UIBaseFileUploadTrigger>
  </Motion>
</template>
