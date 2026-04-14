<script setup lang="ts">
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import AvatarGroup from '@/ui/avatar/avatar-group/AvatarGroup.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'

const profileSrc = '../../../../storybook-assets/profile-picture.jpg'

const avatars: AvatarProps[] = Array.from({
  length: 15,
}, (_, i) => ({

  name: `User ${i + 1}`,
  src: profileSrc,
}))
</script>

<template>
  <ColumnLayout gap="2xl">
    <AvatarGroup
      :avatars="avatars"
      :max="10"
      size="xs"
    />
    <AvatarGroup
      :avatars="avatars"
      :max="10"
      size="sm"
    />
    <AvatarGroup
      :avatars="avatars"
      :max="10"
      size="md"
    />
  </ColumnLayout>
</template>
