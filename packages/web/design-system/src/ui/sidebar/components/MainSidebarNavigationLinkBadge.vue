<script setup lang="ts">
import { UIBadge } from '@/ui/badge/index'
import { useInjectMainSidebarNavigationLinkContext } from '@/ui/sidebar/components/mainSidebarNavigationLink.context'

const props = defineProps<{
  label: string
}>()

const {
  isActive,
} = useInjectMainSidebarNavigationLinkContext()
</script>

<template>
  <UIBadge
    :label="props.label"
    :color="isActive ? 'brand' : 'gray'"
    size="sm"
  />
</template>
