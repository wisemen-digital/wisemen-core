<script setup lang="ts" generic="TValue extends string">
import { DropdownMenuRadioGroup } from 'reka-ui'

import { UIColumnLayout } from '@/ui/column-layout/index'

const modelValue = defineModel<TValue>('modelValue', {
  required: true,
})
</script>

<template>
  <DropdownMenuRadioGroup v-model="modelValue">
    <UIColumnLayout gap="xxs">
      <slot />
    </UIColumnLayout>
  </DropdownMenuRadioGroup>
</template>
