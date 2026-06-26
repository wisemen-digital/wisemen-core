<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'

import type { BaseFileUploadItem } from '@/ui/base-file-upload'

import FormFileUploadListItem from './FormFileUploadListItem.vue'

const props = defineProps<{
  items: BaseFileUploadItem[]
}>()
</script>

<template>
  <Motion
    :initial="{
      opacity: 0,
      transform: 'scale(0.98)',
    }"
    :animate="{
      opacity: 1,
      transform: 'scale(1)',
    }"
    :exit="{
      opacity: 0,
      transform: 'scale(0.98)',
    }"
    as="ul"
    class="flex w-full flex-col gap-sm"
  >
    <AnimatePresence
      :initial="false"
      mode="popLayout"
    >
      <Motion
        v-for="(item, itemIndex) of props.items"
        :key="item.key"
        :initial="{
          opacity: itemIndex === 0 ? 1 : 0,
          transform: itemIndex === 0 ? 'scale(1) translateY(0)' : 'scale(0.99) translateY(-0.5rem)',
        }"
        :animate="{
          opacity: 1,
          transform: 'scale(1) translateY(0)',
        }"
        :exit="{
          opacity: 0,
          transform: 'scale(0.99) translateY(-0.5rem)',
        }"
        :layout="true"
      >
        <FormFileUploadListItem :item="item" />
      </Motion>
    </AnimatePresence>
  </Motion>
</template>
