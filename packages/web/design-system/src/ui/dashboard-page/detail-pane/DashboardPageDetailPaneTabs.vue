<script setup lang="ts">
import { UITabs } from '@/ui/tabs'

const modelValue = defineModel<string>({
  required: true,
})
</script>

<template>
  <UITabs
    v-model="modelValue"
    :is-full-width="true"
    variant="underline"
    underline-tabs-horizontal-list-padding="lg"
    class="flex flex-1 flex-col overflow-hidden"
  >
    <slot />
  </UITabs>
</template>
