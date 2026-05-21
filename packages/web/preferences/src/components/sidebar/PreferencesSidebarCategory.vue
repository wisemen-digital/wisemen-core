<script setup lang="ts">
import { UIColumnLayout } from '@wisemen/vue-core-design-system'

const props = defineProps<{
  label: string | null
}>()
</script>

<template>
  <div class="w-full">
    <span
      v-if="props.label !== null"
      class="block px-lg pb-xs text-xs font-medium text-quaternary"
    >
      {{ props.label }}
    </span>

    <UIColumnLayout gap="xxs">
      <slot />
    </UIColumnLayout>
  </div>
</template>
