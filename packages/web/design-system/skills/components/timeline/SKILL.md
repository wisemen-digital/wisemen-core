---
name: timeline
description: >
  Vertical timeline component with indicator dots, connector lines, and content slots. UITimeline wraps UITimelineItem children with shared size/variant context.
type: component
library: vue-core-design-system
category: display
exports:
  - UITimeline
  - UITimelineItem
---

# UITimeline

A vertical timeline that renders a sequence of events with indicator dots, connector lines, and content areas.

## When to Use

- Displaying a chronological sequence of events (activity feeds, audit logs)
- Showing step-by-step progress indicators
- Rendering change history or version timelines

**Use instead:** A plain ordered list when you do not need visual indicators or connectors.

## Import

```ts
import { UITimeline, UITimelineItem } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UITimeline, UITimelineItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UITimeline>
    <UITimelineItem>
      <p>First event</p>
    </UITimelineItem>
    <UITimelineItem>
      <p>Second event</p>
    </UITimelineItem>
    <UITimelineItem :is-last="true">
      <p>Latest event</p>
    </UITimelineItem>
  </UITimeline>
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/timeline/timeline.props.ts`
- Components: `src/ui/timeline/Timeline.vue`, `src/ui/timeline/TimelineItem.vue`
- Context: `src/ui/timeline/timeline.context.ts`
- Playground: `src/ui/timeline/stories/`

## See Also

- [badge](../badge/SKILL.md) -- For standalone status labels
