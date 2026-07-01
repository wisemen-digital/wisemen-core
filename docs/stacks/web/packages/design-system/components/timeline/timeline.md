<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/timeline/stories/TimelinePlayground.vue'

</script>

# Timeline

Ordered timeline for activity history and step-by-step event lists.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-timeline--default)

## Usage

Wrap `UITimelineItem` entries inside `UITimeline`. Mark the final item with `:is-last="true"` to remove the trailing connector line.

```vue
<script setup lang="ts">
import { CheckCircleIcon, MessageSquare01Icon } from '@wisemen/vue-core-icons'
import { UITimeline, UITimelineItem } from '@wisemen/vue-core'
</script>

<template>
  <UITimeline variant="solid" size="md">
    <UITimelineItem :icon="CheckCircleIcon">
      <p class="text-sm font-medium">File uploaded</p>
      <p class="text-xs text-tertiary">Added to the project repository.</p>
    </UITimelineItem>

    <UITimelineItem :icon="MessageSquare01Icon" :is-last="true">
      <p class="text-sm font-medium">Comment added</p>
      <p class="text-xs text-tertiary">Feedback submitted for review.</p>
    </UITimelineItem>
  </UITimeline>
</template>
```

## API

<!-- @include: ./timeline-meta.md -->
