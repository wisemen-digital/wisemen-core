<script setup lang="ts">
import type { Component } from 'vue'

import { UIAvatar } from '@/ui/avatar'
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

const props = withDefaults(defineProps<{
  avatar?: Omit<AvatarProps, 'size'> | null
  icon?: Component | null
  label: string
  variant?: 'default' | 'error' | 'warning'
}>(), {
  avatar: null,
  icon: null,
  variant: 'default',
})
</script>

<template>
  <UIRowLayout
    gap="xxs"
    class="w-28 shrink-0"
  >
    <div
      v-if="props.icon !== null || props.avatar !== null"
      class="flex aspect-square h-text-xs items-center"
    >
      <UIAvatar
        v-if="props.avatar !== null"
        :name="props.avatar.name"
        :src="props.avatar.src"
        :is-static-color="props.avatar.isStaticColor"
        size="xxs"
      />

      <Component
        :is="props.icon"
        v-else
        :class="{
          'text-disabled': props.variant === 'default',
          'text-warning-primary': props.variant === 'warning',
          'text-error-primary': props.variant === 'error',
        }"
        class="size-3.5"
      />
    </div>

    <UIText
      :text="props.label"
      :class="{
        'text-tertiary': props.variant === 'default',
        'text-warning-primary': props.variant === 'warning',
        'text-error-primary': props.variant === 'error',
      }"
      class="text-xs"
    />
  </UIRowLayout>
</template>
