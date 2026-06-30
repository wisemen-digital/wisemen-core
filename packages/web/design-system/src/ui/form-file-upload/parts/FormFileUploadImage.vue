<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import {
  computed,
  ref,
  useId,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { useOverlay } from '@/ui/dialog'

import FormFileUploadBlurhash from './FormFileUploadBlurhash.vue'
import FormFileUploadImageDialog from './FormFileUploadImageDialog.vue'

const props = withDefaults(defineProps<{
  isZoomEnabled?: boolean
  alt: string
  blurhash?: string | null
  fit: 'contain' | 'cover'
  src: string
}>(), {
  isZoomEnabled: false,
  blurhash: null,
})

const i18n = useI18n()
const id = useId()
const overlay = useOverlay()
const imageDialog = overlay.create(FormFileUploadImageDialog)
const isLoadingImage = ref<boolean>(true)

const openImageLabel = computed<string>(() => i18n.t('component.form_file_upload.preview.open_image'))

function onLoadImage(): void {
  isLoadingImage.value = false
}

function onOpenDialog(): void {
  if (!props.isZoomEnabled) {
    return
  }

  imageDialog.open({
    fit: props.fit,
    imageAlt: props.alt,
    imageUrl: props.src,
  })
}
</script>

<template>
  <div
    :id="id"
    class="relative isolate overflow-hidden"
  >
    <AnimatePresence :initial="false">
      <Motion
        v-if="isLoadingImage && props.blurhash !== null"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.2 }"
        class="absolute inset-0 z-1"
      >
        <FormFileUploadBlurhash :blurhash="props.blurhash" />
      </Motion>
    </AnimatePresence>

    <button
      :class="{
        'pointer-events-none cursor-default': !props.isZoomEnabled,
      }"
      :aria-label="openImageLabel"
      :disabled="!props.isZoomEnabled"
      type="button"
      class="block size-full cursor-pointer outline-none"
      @click="onOpenDialog"
    >
      <img
        :src="props.src"
        :alt="props.alt"
        :class="{
          'object-contain': props.fit === 'contain',
          'object-cover': props.fit === 'cover',
        }"
        class="size-full"
        @load="onLoadImage"
      >
    </button>
  </div>
</template>
