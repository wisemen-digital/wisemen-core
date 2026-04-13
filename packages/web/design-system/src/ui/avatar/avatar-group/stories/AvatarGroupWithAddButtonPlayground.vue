<script setup lang="ts">
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import AvatarGroup from '@/ui/avatar/avatar-group/AvatarGroup.vue'
import AvatarGroupAddButton from '@/ui/avatar/avatar-group/AvatarGroupAddButton.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

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
    <RowLayout
      gap="md"
      align="center"
    >
      <AvatarGroup
        :avatars="avatars"
        :max="10"
        size="xs"
      />
      <AvatarGroupAddButton
        label="Add user"
        size="xs"
      />
    </RowLayout>
    <RowLayout
      gap="md"
      align="center"
    >
      <AvatarGroup
        :avatars="avatars"
        :max="10"
        size="sm"
      />
      <AvatarGroupAddButton
        label="Add user"
        size="sm"
      />
    </RowLayout>
    <RowLayout
      gap="md"
      align="center"
    >
      <AvatarGroup
        :avatars="avatars"
        :max="10"
        size="md"
      />
      <AvatarGroupAddButton
        label="Add user"
        size="md"
      />
    </RowLayout>
  </ColumnLayout>
</template>
