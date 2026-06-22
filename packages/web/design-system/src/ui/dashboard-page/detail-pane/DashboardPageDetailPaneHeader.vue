<script setup lang="ts">
import { UIBaseHeader } from '@/ui/base-header'
import type { DetailPaneHeaderProps } from '@/ui/dashboard-page/detail-pane/detailPaneHeader.props'
import { useInjectDetailPaneScrollContext } from '@/ui/dashboard-page/detail-pane/detailPaneScroll.context'
import { UISeparator } from '@/ui/separator'

const props = withDefaults(defineProps<DetailPaneHeaderProps>(), {
  left: null,
  showSeparator: true,
})

const scrollContext = useInjectDetailPaneScrollContext(null)
</script>

<template>
  <div class="sticky top-0 z-10 bg-primary">
    <div class="p-lg">
      <UIBaseHeader
        :title="props.title"
        :left="props.left"
      >
        <template
          v-if="$slots['title-end']"
          #title-end
        >
          <slot name="title-end" />
        </template>

        <template
          v-if="$slots.subtitle"
          #subtitle
        >
          <slot name="subtitle" />
        </template>

        <template
          v-if="$slots.actions"
          #actions
        >
          <slot name="actions" />
        </template>
      </UIBaseHeader>
    </div>

    <UISeparator
      v-if="props.showSeparator && !(scrollContext?.hasTabs.value)"
    />
  </div>
</template>
