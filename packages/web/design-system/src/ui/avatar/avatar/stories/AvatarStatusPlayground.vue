<script setup lang="ts">
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import Avatar from '@/ui/avatar/avatar/Avatar.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const props = withDefaults(defineProps<{
  size?: AvatarProps['size']
}>(), {
  size: 'md',
})

const profileSrc = '../../../../storybook-assets/profile-picture.jpg'
</script>

<template>
  <RowLayout
    gap="xl"
    align="start"
  >
    <Avatar
      :src="profileSrc"
      :size="props.size"
      name="Olivia Roy"
      status="online"
    />
    <Avatar
      :src="profileSrc"
      :size="props.size"
      name="Olivia Roy"
      status="away"
    />
    <Avatar
      :src="profileSrc"
      :size="props.size"
      name="Olivia Roy"
      status="busy"
    />
    <Avatar
      :src="profileSrc"
      :size="props.size"
      name="Olivia Roy"
      status="offline"
    />
  </RowLayout>
</template>
