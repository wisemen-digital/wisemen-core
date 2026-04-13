<script setup lang="ts">
import Text from '@/ui/text/Text.vue'

const props = defineProps<{
  text: string
}>()
</script>

<template>
  <Text
    :truncate="false"
    :text="props.text"
    class="flex max-w-xs text-center text-xs text-secondary"
  />
</template>
