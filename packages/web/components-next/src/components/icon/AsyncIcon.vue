<script setup lang="ts">
import type { Component } from 'vue'
import {
  computed,
  defineAsyncComponent,
} from 'vue'

import type { IconProps } from '@/components/icon/icon.props'
import { icons } from '@/icons/icons'

const props = defineProps<IconProps>()

const svgComponent = computed<Component>(() =>
  defineAsyncComponent(() => icons[props.icon]))
</script>

<template>
  <Component :is="svgComponent" />
</template>
