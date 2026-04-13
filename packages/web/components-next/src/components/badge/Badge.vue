<script setup lang="ts">
import type { BadgeEmits } from '@/components/badge/badge.emits'
import type { BadgeProps } from '@/components/badge/badge.props'
import BadgeIcon from '@/components/badge/parts/BadgeIcon.vue'
import BadgeRemoveButton from '@/components/badge/parts/BadgeRemoveButton.vue'
import BadgeRoot from '@/components/badge/parts/BadgeRoot.vue'

const props = defineProps<BadgeProps>()
const emit = defineEmits<BadgeEmits>()
</script>

<template>
  <BadgeRoot
    v-bind="props"
    @remove="emit('remove')"
  >
    <BadgeIcon />
    <slot name="left" />
    <slot />
    <slot name="right" />
    <BadgeRemoveButton />
  </BadgeRoot>
</template>
