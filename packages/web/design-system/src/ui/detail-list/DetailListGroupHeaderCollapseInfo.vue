<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'

import { UIBadge } from '@/ui/badge'
import type { DetailListCollapseOptions } from '@/ui/detail-list/detailList.type'

const props = defineProps<{
  isVisible: boolean
  badge: NonNullable<DetailListCollapseOptions['badge']>
}>()
</script>

<template>
  <AnimatePresence :initial="false">
    <Motion
      v-if="props.isVisible && props.badge !== null"
      :initial="{
        opacity: 0,
        width: 0,
        marginLeft: '0rem',
      }"
      :animate="{
        opacity: 1,
        width: 'auto',
        marginLeft: '0.4rem',
      }"
      :exit="{
        opacity: 0,
        width: 0,
        marginLeft: '0rem',
      }"
      :transition="{ duration: 0.15 }"
      class="flex"
    >
      <UIBadge
        v-bind="props.badge"
        size="sm"
      />
    </Motion>
  </AnimatePresence>
</template>
