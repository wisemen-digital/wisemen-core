<script setup lang="ts">
import { VcRadioGroupItemRoot } from '@wisemen/vue-core-components'

import TextHighlight from '@/modules/settings/components/TextHighlight.vue'

const props = defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <VcRadioGroupItemRoot
    :value="props.value"
    class="text-left"
  >
    <div
      class="
        relative h-30 overflow-hidden rounded-xl border border-solid
        border-secondary outline-2 outline-offset-1 outline-transparent
        duration-500
        group-data-[state=checked]/radio-group-item:outline-brand-500
      "
    >
      <div
        class="
          h-full duration-500
          group-data-[state=checked]/radio-group-item:scale-103
        "
      >
        <slot />
      </div>
    </div>

    <label class="mt-md inline-block truncate text-sm font-medium text-primary">
      <TextHighlight :text="props.label" />
    </label>
  </VcRadioGroupItemRoot>
</template>
