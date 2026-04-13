<script setup lang="ts">
import { AvatarImage as RekaAvatarImage } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectAvatarContext } from '@/components/avatar/avatar.context'

const {
  name,
  classConfig,
  customClassConfig,
  src,
  style,
} = useInjectAvatarContext()
</script>

<template>
  <RekaAvatarImage
    v-if="src !== null"
    :src="src"
    :alt="name"
    :class="style.image({
      class: mergeClasses(customClassConfig.image, classConfig?.image),
    })"
  />
</template>
