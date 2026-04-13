<script setup lang="ts">
import type { LogoWithTextProps } from '@/ui/logo/logo.props'
import Logo from '@/ui/logo/Logo.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const props = defineProps<LogoWithTextProps>()
</script>

<template>
  <RowLayout gap="md">
    <Logo
      v-if="props.src !== null"
      :src="props.src"
      :alt="props.name"
      :size="props.size"
    />

    <span
      :class="{
        'text-xl': props.size === 'sm',
        'text-sm': props.size === 'xs',
        'text-xs': props.size === 'xxs',
      }"
      class="font-semibold text-secondary"
    >
      {{ props.name }}
    </span>
  </RowLayout>
</template>
