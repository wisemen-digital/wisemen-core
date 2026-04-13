<script setup lang="ts">
import { ref } from 'vue'

import Button from '@/components/button/default-button/Button.vue'
import Dialog from '@/components/dialog/Dialog.vue'
import DialogCloseButton from '@/components/dialog/parts/DialogCloseButton.vue'
import DialogDescription from '@/components/dialog/parts/DialogDescription.vue'
import DialogTitle from '@/components/dialog/parts/DialogTitle.vue'
import AnimateSize from '@/components/shared/AnimateSize.vue'

const isSmall = ref<boolean>(false)
</script>

<template>
  <Dialog
    :class-config="{
      closeButton: {
      },
    }"
  >
    <AnimateSize>
      <div
        :class="{
          'max-h-40 max-w-80': isSmall,
          'max-h-80 max-w-140': !isSmall,
        }"
        class="h-[90vh] w-[90vw] p-2xl"
      >
        <DialogCloseButton class="absolute! top-2 right-2" />

        <DialogTitle>
          <h1 class="text-2xl font-semibold text-primary">
            Example dialog
          </h1>
        </DialogTitle>

        <DialogDescription>
          <p class="text-secondary">
            This is an example dialog.
          </p>
        </DialogDescription>

        <Button
          class="mt-2xl"
          variant="secondary"
          @click="isSmall = !isSmall"
        >
          Resize
        </Button>
      </div>
    </AnimateSize>
  </Dialog>
</template>
