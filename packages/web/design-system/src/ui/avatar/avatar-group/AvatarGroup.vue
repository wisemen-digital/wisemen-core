<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import Avatar from '@/ui/avatar/avatar/Avatar.vue'
import type { AvatarGroupProps } from '@/ui/avatar/avatar-group/avatarGroup.props'
import { AVATAR_GROUP_DEFAULTS } from '@/ui/avatar/avatar-group/avatarGroup.props'
import type { AvatarGroupStyle } from '@/ui/avatar/avatar-group/avatarGroup.style'
import { createAvatarGroupStyle } from '@/ui/avatar/avatar-group/avatarGroup.style'

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  max: AVATAR_GROUP_DEFAULTS.max,
  size: AVATAR_GROUP_DEFAULTS.size,
})

const visibleAvatars = computed<AvatarProps[]>(() => props.avatars.slice(0, props.max))
const overflowCount = computed<number>(() => props.avatars.length - props.max)

const i18n = useI18n()

const avatarGroupStyle = computed<AvatarGroupStyle>(
  () => createAvatarGroupStyle({
    size: props.size,
  }),
)
</script>

<template>
  <div :class="avatarGroupStyle.root()">
    <Avatar
      v-for="(avatar, index) in visibleAvatars"
      :key="`avatar-${avatar.name}-${avatar.src}-${index}`"
      :class="avatarGroupStyle.avatar()"
      :logo="avatar.logo"
      :logo-alt="avatar.logoAlt"
      :name="avatar.name"
      :size="props.size"
      :src="avatar.src"
    />
    <div
      v-if="overflowCount > 0"
      :class="avatarGroupStyle.overflow()"
    >
      {{ i18n.t('component.avatar_group.overflow', { count: overflowCount }) }}
    </div>
  </div>
</template>
