<script setup lang="ts">
import type { Component } from 'vue'

import { useInjectButtonContext } from '@/ui/button/button/button.context'
import type { ButtonProps } from '@/ui/button/button/button.props'

const props = defineProps<{
  icon: Component
  size: ButtonProps['size']
  variant: ButtonProps['variant']
}>()

const {
  buttonStyle,
} = useInjectButtonContext()
</script>

<template>
  <Component
    :is="props.icon"
    v-if="props.icon !== null"
    :class="buttonStyle.icon()"
  />
</template>
