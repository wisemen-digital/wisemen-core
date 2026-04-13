<script setup lang="ts">
import type { AvatarProps } from '@/components/avatar/avatar.props'
import AvatarFallback from '@/components/avatar/parts/AvatarFallback.vue'
import AvatarImage from '@/components/avatar/parts/AvatarImage.vue'
import AvatarRoot from '@/components/avatar/parts/AvatarRoot.vue'

const props = defineProps<AvatarProps>()
</script>

<template>
  <AvatarRoot v-bind="props">
    <AvatarImage />
    <AvatarFallback />
  </AvatarRoot>
</template>
