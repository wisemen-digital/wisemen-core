<script setup lang="ts">
import Loader from '@/ui/loader/Loader.vue'

const props = withDefaults(defineProps<{
  size?: 'lg' | 'md' | 'sm'
}>(), {
  size: 'md',
})

const sizeClasses = {
  lg: 'size-8',
  md: 'size-6',
  sm: 'size-4',
} as const
</script>

<template>
  <Loader
    :class="sizeClasses[props.size]"
    class="text-primary"
  />
</template>
