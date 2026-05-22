<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { watch } from 'vue'

import { useInjectConfigContext } from '@/ui/config-provider'

const props = defineProps<{
  title: string
}>()

const configContext = useInjectConfigContext()
const documentTitle = useTitle()

watch([
  (): string => props.title,
  configContext.projectName,
], ([
  title,
  projectName,
]) => {
  documentTitle.value = `${title} — ${projectName}`
}, {
  immediate: true,
})
</script>

<template>
  <main
    id="main-content"
    class="
      custom-content-shadow min-h-0 flex-1 overflow-hidden rounded-xl border
      border-secondary
      dark:shadow-none
    "
  >
    <slot />
  </main>
</template>

<style scoped>
.custom-content-shadow {
  box-shadow:
    lch(0 0 0 / 0.02) 0px 3px 6px -2px,
    lch(0 0 0 / 0.04) 0px 1px 1px;
}
</style>
