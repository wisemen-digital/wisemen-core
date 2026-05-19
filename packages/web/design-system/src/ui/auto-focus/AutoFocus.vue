<script setup lang="ts">
import { Primitive } from 'reka-ui'
import {
  onMounted,
  ref,
} from 'vue'

const primitiveRef = ref<InstanceType<typeof Primitive> | null>(null)

function findFirstFocusableElement(element: HTMLElement): HTMLElement | null {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )

  const [
    firstFocusableElement,
  ] = Array.from(focusableElements)

  return firstFocusableElement ?? null
}

onMounted(() => {
  const primitiveEl = primitiveRef.value?.$el as HTMLElement | null

  if (primitiveEl === null) {
    return
  }

  const firstFocusableElement = findFirstFocusableElement(primitiveEl)

  if (firstFocusableElement === null) {
    return
  }

  setTimeout(() => {
    firstFocusableElement.focus()
  })
})
</script>

<template>
  <Primitive ref="primitiveRef">
    <slot />
  </Primitive>
</template>
