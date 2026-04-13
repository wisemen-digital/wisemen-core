<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import {
  computed,
  ref,
  useTemplateRef,
  watch,
} from 'vue'

import { UIButton } from '@/ui/button'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import { useInjectDialogContext } from '@/ui/dialog/dialog.context'
import type { chinConfig } from '@/ui/dialog/dialogChin.composable'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const props = defineProps<{
  chin: chinConfig | null
}>()

const isOpen = computed<boolean>(() => props.chin !== null)

const chinContentRef = useTemplateRef('chinContent')
const chinHeight = ref<number>(38)

watch(chinContentRef, (el) => {
  if (el == null) {
    return
  }

  const observer = new ResizeObserver((
    [
      entry,
    ],
  ) => {
    chinHeight.value = entry.contentRect.height
  })

  observer.observe(el)
}, {
  immediate: true,
})

const variantFromColor: Record<NonNullable<chinConfig['variant']>, string> = {
  default: 'from-white/60 dark:from-black/10',
  error: 'from-error-secondary',
}

const overlayFromColor = computed<string>(() => props.chin?.variant != null ? variantFromColor[props.chin.variant] : 'from-white/60')
const iconColor = computed<string>(() => props.chin?.variant === 'error' ? 'text-error-500' : 'text-primary')

const {
  style,
} = useInjectDialogContext()
</script>

<template>
  <Motion
    :animate="{ height: isOpen ? `calc(100% + ${(chinHeight + 14)}px)` : '100%' }"
    :initial="false"
    :transition="{
      duration: 0.3,
      type: 'spring',
      bounce: 0,
    }"
    :class="style.chin()"
    class="
      bg-white/20
      dark:bg-black/40
    "
    as="div"
  >
    <AnimatePresence>
      <Motion
        v-if="isOpen"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.3 }"
        :class="overlayFromColor"
        class="
          h-full rounded-t-[calc(1rem+5px)] rounded-b-none bg-linear-to-t
          to-transparent
          sm:rounded-[calc(1rem+5px)]
        "
        as="div"
      >
        <ColumnLayout
          justify="end"
          class="h-full p-lg px-xl"
        >
          <div ref="chinContent">
            <RowLayout
              align="center"
            >
              <Component
                :is="props.chin?.icon"
                v-if="chin?.icon"
                :class="iconColor"
                class="size-4 shrink-0 text-error-500"
              />
              <span class="text-xs font-medium">{{ chin?.text }}</span>
              <UIButton
                variant="tertiary"
                label="Discard"
              />
              <UIButton
                variant="minimal-color"
                label="Save"
              />
            </RowLayout>
          </div>
        </ColumnLayout>
      </Motion>
    </AnimatePresence>
  </Motion>
</template>
