<script setup lang="ts">
/**
 * Conditionally renders its children based on the available horizontal space and an explicit priority order.
 *
 * Children register themselves as content blocks with a priority. During layout evaluation,
 * the container measures its width and progressively hides lower-priority blocks until the remaining content fits
 * within the available space.
 *
 * It's very important that this element is performant, as it may be used in frequently re-rendered
 * parts of the application. Don't change the implementation without considering performance implications.
 */

import { Primitive } from 'reka-ui'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
} from 'vue'

import { useProvideAdaptiveContentContext } from '@/ui/adaptive-content/adaptiveContent.context'
import type { AdaptiveContentBlock } from '@/ui/adaptive-content/adaptiveContent.type'

interface AdaptiveContentBlockWithWidth extends AdaptiveContentBlock {
  width: number
}

const containerRef = useTemplateRef('container')
let resizeObserver: ResizeObserver | null = null
let isLayoutScheduled = false
let isEvaluating = false
let isPendingEvaluation = false

const blocks = ref<Map<string, AdaptiveContentBlockWithWidth>>(new Map())
const visibleBlockIds = ref<Set<string>>(new Set())

function registerBlock(block: AdaptiveContentBlock): void {
  blocks.value.set(block.id, {
    ...block,
    width: block.element.offsetWidth,
  })

  scheduleLayoutEvaluation()
}

function unregisterBlock(id: string): void {
  blocks.value.delete(id)
  visibleBlockIds.value.delete(id)

  scheduleLayoutEvaluation()
}

function scheduleLayoutEvaluation(): void {
  if (isEvaluating) {
    isPendingEvaluation = true

    return
  }

  if (isLayoutScheduled) {
    return
  }

  isLayoutScheduled = true

  requestAnimationFrame(() => {
    isLayoutScheduled = false
    evaluateLayout()
  })
}

function groupBlocksByPriority(): Map<number, AdaptiveContentBlockWithWidth[]> {
  const blocksSortedByPriority: [string, AdaptiveContentBlockWithWidth][] = [
    ...blocks.value.entries(),
  ].toSorted((a, b) => a[1].priority - b[1].priority)

  const groupedBlocks = new Map<number, AdaptiveContentBlockWithWidth[]>()

  for (const [
    , block,
  ] of blocksSortedByPriority) {
    if (!groupedBlocks.has(block.priority)) {
      groupedBlocks.set(block.priority, [])
    }

    groupedBlocks.get(block.priority)?.push(block)
  }

  return groupedBlocks
}

function getSortedPriorities(blocks: Map<number, AdaptiveContentBlockWithWidth[]>): number[] {
  return [
    ...blocks.keys(),
  ].toSorted((a, b) => a - b)
}

function getContainerElement(): HTMLElement | null {
  return containerRef.value?.$el as HTMLElement
}

async function evaluateLayout(): Promise<void> {
  const container = getContainerElement()

  if (container === null) {
    return
  }

  isEvaluating = true
  visibleBlockIds.value = new Set()

  const blocksPerPriority = groupBlocksByPriority()
  const sortedPriorities = getSortedPriorities(blocksPerPriority)

  for (const priority of sortedPriorities) {
    const group = blocksPerPriority.get(priority)!

    for (const block of group) {
      visibleBlockIds.value.add(block.id)
    }

    await nextTick()

    if (container.scrollWidth > container.clientWidth) {
      for (const block of group) {
        visibleBlockIds.value.delete(block.id)
      }

      const lowerPriorities = sortedPriorities.slice(sortedPriorities.indexOf(priority) + 1)

      for (const lowerPriority of lowerPriorities) {
        const group = blocksPerPriority.get(lowerPriority)!

        // eslint-disable-next-line max-depth
        for (const block of group) {
          visibleBlockIds.value.delete(block.id)
        }
      }

      break
    }
  }

  isEvaluating = false

  if (isPendingEvaluation) {
    isPendingEvaluation = false
    scheduleLayoutEvaluation()
  }
}

onMounted(() => {
  resizeObserver = new ResizeObserver(scheduleLayoutEvaluation)
  resizeObserver.observe(containerRef.value?.$el)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

useProvideAdaptiveContentContext({
  registerBlock,
  scheduleLayoutEvaluation,
  unregisterBlock,
  visibleBlockIds: computed<Set<string>>(() => visibleBlockIds.value),
})
</script>

<template>
  <Primitive
    ref="container"
    :as-child="true"
  >
    <slot :hidden-block-count="blocks.size - visibleBlockIds.size" />
  </Primitive>
</template>
