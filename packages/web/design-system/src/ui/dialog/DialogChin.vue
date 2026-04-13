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

import {
  UIButton,
  UIIconButton,
  UILink,
} from '@/ui/button'
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
    chinHeight.value = entry?.contentRect.height ?? 0
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

const buttonVariantMap = {
  brand: 'minimal-color',
  default: 'tertiary',
  destructive: 'destructive-tertiary',
} as const

const linkVariantMap = {
  brand: 'primary',
  default: 'tertiary',
  destructive: 'destructive-tertiary',
} as const
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
          <div
            ref="chinContent"
            class="w-full"
          >
            <RowLayout
              align="center"
              justify="between"
            >
              <RowLayout>
                <Component
                  :is="props.chin?.icon"
                  v-if="chin?.icon"
                  :class="iconColor"
                  class="size-4 shrink-0 text-error-500"
                />
                <span class="text-xs font-medium">{{ chin?.text }}</span>
              </RowLayout>
              <RowLayout
                items="center"
                gap="none"
              >
                <template v-if="props.chin?.secondaryAction">
                  <UIButton
                    v-if="props.chin.secondaryAction.type === 'button'"
                    :label="props.chin.secondaryAction.label"
                    :is-loading="props.chin.secondaryAction.isLoading"
                    :is-disabled="props.chin.secondaryAction.isDisabled"
                    :disabled-reason="props.chin.secondaryAction.disabledReason"
                    :variant="buttonVariantMap[props.chin.secondaryAction.variant ?? 'default']"
                    @click="props.chin.secondaryAction.action"
                  />
                  <UILink
                    v-else-if="props.chin.secondaryAction.type === 'link'"
                    :label="props.chin.secondaryAction.label"
                    :to="props.chin.secondaryAction.to"
                    :link="props.chin.secondaryAction.link"
                    :variant="linkVariantMap[props.chin.secondaryAction.variant ?? 'default']"
                  />
                  <UIIconButton
                    v-else-if="props.chin.secondaryAction.type === 'icon-button'"
                    :icon="props.chin.secondaryAction.icon"
                    :label="props.chin.secondaryAction.label"
                    :is-loading="props.chin.secondaryAction.isLoading"
                    :is-disabled="props.chin.secondaryAction.isDisabled"
                    :disabled-reason="props.chin.secondaryAction.disabledReason"
                    :variant="linkVariantMap[props.chin.secondaryAction.variant ?? 'default']"
                    @click="props.chin.secondaryAction.action"
                  />
                </template>
                <template v-if="props.chin?.primaryAction">
                  <UIButton
                    v-if="props.chin.primaryAction.type === 'button'"
                    :label="props.chin.primaryAction.label"
                    :is-loading="props.chin.primaryAction.isLoading"
                    :is-disabled="props.chin.primaryAction.isDisabled"
                    :disabled-reason="props.chin.primaryAction.disabledReason"
                    :variant="buttonVariantMap[props.chin.primaryAction.variant ?? 'brand']"
                    @click="props.chin.primaryAction.action"
                  />
                  <UILink
                    v-else-if="props.chin.primaryAction.type === 'link'"
                    :label="props.chin.primaryAction.label"
                    :to="props.chin.primaryAction.to"
                    :link="props.chin.primaryAction.link"
                    :variant="linkVariantMap[props.chin.primaryAction.variant ?? 'brand']"
                  />
                  <UIIconButton
                    v-else-if="props.chin.primaryAction.type === 'icon-button'"
                    :icon="props.chin.primaryAction.icon"
                    :label="props.chin.primaryAction.label"
                    :is-loading="props.chin.primaryAction.isLoading"
                    :is-disabled="props.chin.primaryAction.isDisabled"
                    :disabled-reason="props.chin.primaryAction.disabledReason"
                    :variant="linkVariantMap[props.chin.primaryAction.variant ?? 'brand']"
                    @click="props.chin.primaryAction.action"
                  />
                </template>
              </RowLayout>
            </RowLayout>
          </div>
        </ColumnLayout>
      </Motion>
    </AnimatePresence>
  </Motion>
</template>
