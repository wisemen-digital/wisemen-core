<script setup lang="ts">
import { useInjectBadgeContext } from '@/ui/badge/badge.context'
import { UIText } from '@/ui/text/index'

const props = defineProps<{
  label: string
}>()

const {
  variants,
} = useInjectBadgeContext()
</script>

<template>
  <UIText
    :text="props.label"
    :class="variants.label()"
  />
</template>
