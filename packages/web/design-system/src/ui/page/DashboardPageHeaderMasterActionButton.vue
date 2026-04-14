<script setup lang="ts">
import type { Component } from 'vue'

import IconButton from '@/ui/button/icon/IconButton.vue'

const props = defineProps<{
  icon: Component
  label: string
}>()
</script>

<template>
  <IconButton
    :icon="props.icon"
    :label="props.label"
    variant="tertiary"
  />
</template>
