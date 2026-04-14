<script setup lang="ts">
import { useInjectDialogContext } from '@/ui/dialog/dialog.context'
import type { DialogFooterProps } from '@/ui/dialog/dialogFooter.props'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import { UISeparator } from '@/ui/separator/index'

const props = withDefaults(defineProps<DialogFooterProps>(), {
  showSeparator: true,
})

const dialogContext = useInjectDialogContext(null)
</script>

<template>
  <div :class="dialogContext?.style.value.footer()">
    <UISeparator
      v-if="props.showSeparator"
      :class="
        dialogContext !== null && dialogContext.isScrolledToBottom.value
          ? 'opacity-0'
          : 'opacity-100'
      "
      class="transition-opacity duration-150"
    />

    <RowLayout
      align="center"
      justify="between"
      gap="lg"
      class="
        p-xl
        group-has-data-dialog-body/dialog:pt-3xl
      "
    >
      <div>
        <slot name="left" />
      </div>

      <RowLayout
        align="center"
      >
        <slot name="right" />
      </RowLayout>
    </RowLayout>
  </div>
</template>
