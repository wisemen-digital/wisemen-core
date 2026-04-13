<script setup lang="ts">
import AsyncIcon from '@/components/icon/AsyncIcon.vue'
import type { IconProps } from '@/components/icon/icon.props'

const props = defineProps<IconProps>()
</script>

<template>
  <div aria-hidden="true">
    <Suspense>
      <AsyncIcon :icon="props.icon" />
    </Suspense>
  </div>
</template>
