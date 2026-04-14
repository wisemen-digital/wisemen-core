<script setup lang="ts">
import { onBeforeUnmount } from 'vue'

import { useInjectDialogContext } from '@/ui/dialog/dialog.context'

const {
  bodyRef, style,
} = useInjectDialogContext()

function setBodyRef(el: unknown): void {
  bodyRef.value = (el as HTMLElement | null) ?? null
}

onBeforeUnmount(() => {
  bodyRef.value = null
})
</script>

<template>
  <div
    :ref="setBodyRef"
    :class="style.body()"
    data-dialog-body
  >
    <slot />
  </div>
</template>
