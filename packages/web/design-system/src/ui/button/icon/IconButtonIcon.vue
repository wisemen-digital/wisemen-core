<script setup lang="ts">
import type { Component } from 'vue'

import { useInjectIconButtonContext } from '@/ui/button/icon/iconButton.context'

const props = defineProps<{
  icon: Component
}>()

const {
  iconButtonStyle,
} = useInjectIconButtonContext()
</script>

<template>
  <Component
    :is="props.icon"
    v-if="props.icon !== null"
    :class="iconButtonStyle.icon()"
  />
</template>
