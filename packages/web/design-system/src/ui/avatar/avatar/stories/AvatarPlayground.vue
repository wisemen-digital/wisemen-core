<script setup lang="ts">
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import Avatar from '@/ui/avatar/avatar/Avatar.vue'

const props = withDefaults(defineProps<{
  size?: AvatarProps['size']
}>(), {
  size: 'md',
})

const profileSrc = '../../../../storybook-assets/profile-picture.jpg'
</script>

<template>
  <Avatar
    :src="profileSrc"
    :size="props.size"
    image-alt="Olivia Roy's avatar"
    name="Olivia Roy"
  />
</template>
