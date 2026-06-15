<script setup lang="ts">
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import Avatar from '@/ui/avatar/avatar/Avatar.vue'

const props = withDefaults(defineProps<{
  size?: AvatarProps['size']
}>(), {
  size: 'md',
})

const profileSrc = '../../../../storybook-assets/profile-picture.jpg'
const logoSrc = '../../../../storybook-assets/wisemen-logo.png'
</script>

<template>
  <Avatar
    :logo="logoSrc"
    :src="profileSrc"
    :size="props.size"
    name="Olivia Roy"
  />
</template>
