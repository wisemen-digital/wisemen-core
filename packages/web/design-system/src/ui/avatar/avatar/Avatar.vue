<script setup lang="ts">
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from 'reka-ui'
import { computed } from 'vue'

import type { AvatarColorStyle } from '@/ui/avatar/avatar/avatar.constant'
import { avatarColorMap } from '@/ui/avatar/avatar/avatar.constant'
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import { AVATAR_DEFAULTS } from '@/ui/avatar/avatar/avatar.props'
import type { AvatarStyle } from '@/ui/avatar/avatar/avatar.style'
import { createAvatarStyle } from '@/ui/avatar/avatar/avatar.style'

const props = withDefaults(defineProps<AvatarProps>(), {
  ...AVATAR_DEFAULTS,
})

const avatarStyle = computed<AvatarStyle>(
  () => createAvatarStyle({
    size: props.size,
    status: props.status ?? undefined,
  }),
)

const style = computed<AvatarColorStyle>(
  () => avatarColorMap[getAvatarIndex(props.name, avatarColorMap.length)]!,
)

function getInitials(name: string): string {
  const nameParts = name.split(' ')
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase())
  const count = props.size === 'xxs' ? 1 : 2

  return initials.slice(0, count).join('')
}

function getAvatarIndex(name: string, length: number): number {
  let hash = 0

  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash) % length
}
</script>

<template>
  <AvatarRoot :class="avatarStyle.root()">
    <AvatarImage
      v-if="props.src"
      :src="props.src"
      :class="avatarStyle.base()"
      :alt="props.name"
    />

    <AvatarFallback
      :class="avatarStyle.fallBack({
        class: props.isStaticColor
          ? undefined
          : `${style.backgroundColor} ${style.textColor}`,
      })"
    >
      {{ getInitials(props.name) }}
    </AvatarFallback>

    <span
      v-if="props.status !== null"
      :class="avatarStyle.statusDot()"
    />

    <img
      v-else-if="props.logo"
      :src="props.logo"
      :alt="props.logoAlt ?? 'Avatar Logo'"
      :class="avatarStyle.logo()"
    >
  </AvatarRoot>
</template>
