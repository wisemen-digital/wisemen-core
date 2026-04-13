<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { Motion } from 'motion-v'
import {
  injectListboxRootContext,
  ListboxContent as RekaListboxContent,
} from 'reka-ui'
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectSelectContext } from '@/components/select/select.context'

const {
  id,
  hasScrolledInDropdownContent,
  classConfig,
  customClassConfig,
  style,
} = useInjectSelectContext()

const listboxRootContext = injectListboxRootContext()
const listboxContentRef = ref<InstanceType<any> | null>(null)
const listboxContentWrapperRef = ref<HTMLDivElement | null>(null)

const listboxSize = useElementSize(listboxContentWrapperRef)

function getOptions(): HTMLElement[] {
  const el = listboxContentRef.value?.$el ?? null as HTMLElement | null

  if (el === null) {
    return []
  }

  return Array.from(el.querySelectorAll('[role=option]')) as HTMLElement[]
}

function highlightSelectedOrFirstOption(
  options: HTMLElement[],
): void {
  if (options.length === 0) {
    return
  }

  const selectedOptionIndex = options.findIndex(
    (option) => option.getAttribute('aria-selected') === 'true',
  )

  const optionToSelect = selectedOptionIndex === -1
    ? options[0]
    : options[selectedOptionIndex]

  setTimeout(() => {
    listboxRootContext.changeHighlight(optionToSelect as HTMLElement)
  })
}

function onScroll(event: Event): void {
  const eventTarget = event.target as HTMLElement

  hasScrolledInDropdownContent.value = eventTarget.scrollTop !== 0
}

onMounted(() => {
  // Wait for children to be rendered
  setTimeout(() => {
    const options = getOptions()

    highlightSelectedOrFirstOption(options)
  })
})

onBeforeUnmount(() => {
  listboxRootContext.highlightedElement.value = null
})
</script>

<template>
  <Motion
    :animate="{
      height: listboxSize.height.value,
    }"
    :transition="{
      type: 'spring',
      bounce: 0,
      duration: 0.3,
    }"
    tabindex="-1"
    class="overflow-hidden"
  >
    <div ref="listboxContentWrapperRef">
      <RekaListboxContent
        :id="`${id}-content`"
        ref="listboxContentRef"
        :class="style.content({
          class: mergeClasses(customClassConfig.content, classConfig?.content),
        })"
        @scroll="onScroll"
      >
        <slot />
      </RekaListboxContent>
    </div>
  </Motion>
</template>
