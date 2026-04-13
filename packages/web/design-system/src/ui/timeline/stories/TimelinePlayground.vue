<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<script setup lang="ts">
import {
  CheckCircleIcon,
  Loading02Icon,
  MessageSquare01Icon,
  User01Icon,
} from '@wisemen/vue-core-icons'

import { UIText } from '@/ui/text/index'
import type {
  TimelineSize,
  TimelineVariant,
} from '@/ui/timeline/timeline.props'
import Timeline from '@/ui/timeline/Timeline.vue'
import TimelineItem from '@/ui/timeline/TimelineItem.vue'

withDefaults(defineProps<{
  size?: TimelineSize
  variant?: TimelineVariant
}>(), {
  size: 'md',
  variant: 'solid',
})
</script>

<template>
  <div class="w-md p-4">
    <Timeline
      :size="size"
      :variant="variant"
    >
      <TimelineItem :icon="CheckCircleIcon">
        <UIText
          class="text-xs font-medium"
          text="Phoenix Baker"
        />
        <UIText
          class="text-xs text-tertiary"
          text="Added a file to the project repository."
        />
      </TimelineItem>

      <TimelineItem :icon="MessageSquare01Icon">
        <UIText
          class="text-xs font-medium"
          text="Task complete"
        />
        <UIText
          class="text-xs text-tertiary"
          text="The initial setup has been completed successfully."
        />
      </TimelineItem>

      <TimelineItem :icon="Loading02Icon">
        <UIText
          class="text-xs font-medium"
          text="Task complete"
        />
        <UIText
          class="text-xs text-tertiary"
          text="The initial setup has been completed successfully."
        />
      </TimelineItem>

      <TimelineItem
        :icon="User01Icon"
        :is-last="true"
      >
        <UIText
          class="text-xs font-medium"
          text="Task complete"
        />
        <UIText
          class="text-xs text-tertiary"
          text="The initial setup has been completed successfully."
        />
      </TimelineItem>
    </Timeline>
  </div>
</template>
