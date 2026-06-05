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
  >
    <slot />
  </main>
</template>
