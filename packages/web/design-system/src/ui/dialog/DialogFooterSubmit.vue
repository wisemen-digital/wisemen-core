<script setup lang="ts">
import { useHotkey } from '@tanstack/vue-hotkeys'

import { UIButton } from '@/ui/button'
import { useInjectFormContext } from '@/ui/form'

const props = withDefaults(defineProps<{
  isDestructive?: boolean
  isDisabled?: boolean
  label: string
}>(), {
  isDestructive: false,
  isDisabled: false,
})

const {
  form,
} = useInjectFormContext()

useHotkey('Mod+Enter', () => {
  form.submit()
})
</script>

<template>
  <UIButton
    :label="props.label"
    :is-loading="form.isSubmitting.value"
    :is-disabled="props.isDisabled"
    :keyboard-shortcut="{
      key: 'Enter',
      mod: true,
    }"
    :variant="props.isDestructive ? 'destructive-primary' : 'primary'"
    @click="form.submit"
  />
</template>
