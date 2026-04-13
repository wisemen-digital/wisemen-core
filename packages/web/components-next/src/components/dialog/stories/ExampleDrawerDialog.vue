<script setup lang="ts">
import { Motion } from 'motion-v'

import DialogContent from '@/components/dialog/parts/DialogContent.vue'
import DialogDescription from '@/components/dialog/parts/DialogDescription.vue'
import DialogOverlay from '@/components/dialog/parts/DialogOverlay.vue'
import DialogOverlayTransition from '@/components/dialog/parts/DialogOverlayTransition.vue'
import DialogRoot from '@/components/dialog/parts/DialogRoot.vue'
import DialogTitle from '@/components/dialog/parts/DialogTitle.vue'

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <DialogRoot
    :class-config="{
      content: 'top-3 right-3 left-auto translate-x-0 translate-y-0 w-100 h-[calc(100vh-1.5rem)]',
    }"
    @close="emit('close')"
  >
    <DialogContent>
      <Motion
        :initial="{ opacity: 0,
                    x: '100%' }"
        :animate="{ opacity: 1,
                    x: 0 }"
        :exit="{ opacity: 0,
                 x: '100%' }"
        :transition="{
          duration: 0.5,
          type: 'spring',
          bounce: 0.2,
        }"
        :drag-constraints="{
          left: 0,
          right: 0,
        }"
        :drag-elastic="{
          left: 0.05,
          right: 0.5,
        }"
        drag="x"
        @pan-end="(_a, panInfo) => {
          if (panInfo.offset.x > 200) {
            emit('close')
          }
        }"
      >
        <div class="p-2xl">
          <DialogTitle>
            <h1 class="text-2xl font-semibold text-primary">
              Example drawer
            </h1>
          </DialogTitle>

          <DialogDescription>
            <p class="text-secondary">
              This is an example drawer.
            </p>
          </DialogDescription>
        </div>
      </Motion>
    </DialogContent>

    <DialogOverlay>
      <DialogOverlayTransition />
    </DialogOverlay>
  </DialogRoot>
</template>
