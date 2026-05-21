<script setup lang="ts">
import type { Component } from 'vue'

import { UIAvatar } from '@/ui/avatar'
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

const props = withDefaults(defineProps<{
  avatar?: Omit<AvatarProps, 'size'> | null
  icon?: Component | null
  text: string
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
    align="start"
  >
    <div
      v-if="props.icon !== null || props.avatar !== null"
      class="flex aspect-square h-text-xs items-center"
    >
      <UIAvatar
        v-if="props.avatar !== null"
        v-bind="props.avatar"
        size="xxs"
      />

      <Component
        :is="props.icon"
        v-else-if="props.icon !== null"
        :class="{
          'text-disabled': props.variant === 'default',
          'text-warning-primary': props.variant === 'warning',
          'text-error-primary': props.variant === 'error',
        }"
        class="size-3.5"
      />
    </div>

    <UIText
      :truncate="false"
      :text="props.text"
      :class="{
        'text-primary': props.variant === 'default',
        'text-warning-primary': props.variant === 'warning',
        'text-error-primary': props.variant === 'error',
      }"
      class="text-xs"
    />
  </UIRowLayout>
</template>
