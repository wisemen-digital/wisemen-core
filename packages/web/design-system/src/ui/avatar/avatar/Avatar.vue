<script setup lang="ts">
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from 'reka-ui'
import { computed } from 'vue'

import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import { AVATAR_DEFAULTS } from '@/ui/avatar/avatar/avatar.props'
import type { AvatarStyle } from '@/ui/avatar/avatar/avatar.style'
import { createAvatarStyle } from '@/ui/avatar/avatar/avatar.style'

const props = withDefaults(defineProps<AvatarProps>(), {
  ...AVATAR_DEFAULTS,
})

function getInitials(name: string): string {
  const nameParts = name.split(' ')
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase())

  const firstTwoInitials = initials.slice(0, 2).join('')

  return firstTwoInitials
}

const avatarStyle = computed<AvatarStyle>(
  () => createAvatarStyle({
    size: props.size,
    status: props.status ?? undefined,
  }),
)
</script>

<template>
  <div :class="avatarStyle.root()">
    <AvatarRoot
      :as-child="true"
    >
      <AvatarImage
        v-if="props.src"
        :src="props.src"
        :class="avatarStyle.base()"
        :alt="props.imageAlt ?? 'Avatar'"
      />
      <AvatarFallback
        :class="avatarStyle.fallBack()"
      >
        {{ getInitials(props.name) }}
      </AvatarFallback>
    </AvatarRoot>
    <span
      v-if="props.status != null"
      :class="avatarStyle.statusDot()"
    />
    <img
      v-else-if="props.logo"
      :src="props.logo"
      :alt="props.logoAlt ?? 'Avatar Logo'"
      :class="avatarStyle.logo()"
    >
  </div>
</template>
