<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import {
  UIDialog,
  UIDialogBody,
  UIDialogHeader,
} from '@/ui/dialog'

const props = withDefaults(defineProps<{
  isOpen?: boolean
  fit: 'contain' | 'cover'
  imageAlt: string
  imageUrl: string
}>(), {
  isOpen: false,
})

defineEmits<{
  afterLeave: []
  close: []
}>()

const i18n = useI18n()
</script>

<template>
  <UIDialog
    :is-open="isOpen"
    size="lg"
    @update:is-open="!$event && $emit('close')"
    @after-leave="$emit('afterLeave')"
  >
    <UIDialogHeader
      :description="props.imageAlt"
      :hide-description="props.imageAlt.length === 0"
      :title="i18n.t('component.form_file_upload.preview.dialog_title')"
    />

    <UIDialogBody>
      <img
        :src="props.imageUrl"
        :alt="props.imageAlt"
        :class="{
          'object-contain': props.fit === 'contain',
          'object-cover': props.fit === 'cover',
        }"
        class="mx-auto max-h-180 w-full rounded-lg"
      >
    </UIDialogBody>
  </UIDialog>
</template>
