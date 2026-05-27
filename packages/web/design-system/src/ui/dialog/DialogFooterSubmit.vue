<script setup lang="ts">
import { useHotkey } from '@tanstack/vue-hotkeys'

import { UIButton } from '@/ui/button'
import { useInjectFormContext } from '@/ui/form'

const props = defineProps<{
  label: string
}>()

const {
  form,
} = useInjectFormContext()

useHotkey('Meta+Enter', () => {
  form.submit()
})
</script>

<template>
  <UIButton
    :label="props.label"
    :is-loading="form.isSubmitting.value"
    :keyboard-shortcut="{
      key: 'Enter',
      meta: true,
    }"
    variant="primary"
    @click="form.submit"
  />
</template>
