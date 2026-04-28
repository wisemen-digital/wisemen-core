<script setup lang="ts">
import { UIAvatar } from '@/ui/avatar/index'

const props = defineProps<{
  name: string
  src?: string | null
}>()
</script>

<template>
  <UIAvatar
    :name="props.name"
    :src="props.src ?? null"
    size="xxs"
  />
</template>
