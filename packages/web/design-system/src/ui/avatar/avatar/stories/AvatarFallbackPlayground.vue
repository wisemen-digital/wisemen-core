<script setup lang="ts">
import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'
import Avatar from '@/ui/avatar/avatar/Avatar.vue'

const props = withDefaults(defineProps<{
  size?: AvatarProps['size']
}>(), {
  size: 'md',
})
</script>

<template>
  <Avatar
    :size="props.size"
    name="Olivia Roy"
  />
</template>
