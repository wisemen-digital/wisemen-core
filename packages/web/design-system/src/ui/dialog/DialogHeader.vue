<script setup lang="ts">
import {
  DialogDescription as RekaDialogDescription,
  DialogTitle as RekaDialogTitle,
} from 'reka-ui'
import { computed } from 'vue'

import { tv } from '@/styles/tailwindVariants.lib'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import { useInjectDialogContext } from '@/ui/dialog/dialog.context'
import type { DialogHeaderProps } from '@/ui/dialog/dialogHeader.props'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import { UISeparator } from '@/ui/separator/index'

const props = withDefaults(defineProps<DialogHeaderProps>(), {
  description: null,
  icon: null,
  iconVariant: 'brand',
  showCloseButton: true,
  showSeparator: true,
})

const iconVariantStyle = tv({
  slots: {
    bg: '',
    text: '',
  },
  variants: {
    variant: {
      brand: {
        bg: 'bg-brand-secondary',
        text: 'text-brand-primary',
      },
      error: {
        bg: 'bg-error-secondary',
        text: 'text-error-primary',
      },
      success: {
        bg: 'bg-success-secondary',
        text: 'text-success-primary',
      },
      warning: {
        bg: 'bg-warning-secondary',
        text: 'text-warning-primary',
      },
    },
  },
})

const iconClasses = computed(() => iconVariantStyle({
  variant: props.iconVariant,
}))

const dialogContext = useInjectDialogContext(null)
</script>

<template>
  <ColumnLayout
    :class="dialogContext?.style.value.header()"
    gap="none"
  >
    <RowLayout
      align="start"
      gap="xl"
      class="
        p-xl pb-0
        group-has-data-dialog-body/dialog:pb-3xl
      "
    >
      <div
        v-if="props.icon !== null"
        :class="iconClasses.bg()"
        class="flex size-10 shrink-0 items-center justify-center rounded-full"
      >
        <Component
          :is="props.icon"
          :class="iconClasses.text()"
          class="size-5"
        />
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-xxs">
        <RekaDialogTitle
          as="h2"
          class="text-sm font-semibold text-primary"
        >
          {{ props.title }}
        </RekaDialogTitle>

        <RekaDialogDescription
          v-if="props.description !== null"
          as="p"
          class="text-xs text-tertiary"
        >
          {{ props.description }}
        </RekaDialogDescription>
      </div>
    </RowLayout>

    <UISeparator
      v-if="props.showSeparator"
      :class="
        dialogContext !== null && dialogContext.isScrolledToTop.value
          ? 'opacity-0'
          : 'opacity-100'
      "
      class="transition-opacity duration-150"
    />
  </ColumnLayout>
</template>
