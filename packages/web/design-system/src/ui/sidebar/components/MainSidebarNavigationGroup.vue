<script setup lang="ts">
import { UIColumnLayout } from '@/ui/column-layout/index'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'

const props = withDefaults(defineProps<{
  label?: string | null
}>(), {
  label: null,
})

const {
  isSidebarOpen, collapsedVariant,
} = useMainSidebar()
</script>

<template>
  <div class="w-full">
    <span
      v-if="props.label !== null"
      :class="{
        'opacity-0': collapsedVariant === 'minified' && !isSidebarOpen,
      }"
      class="
        block px-sm pb-sm text-xs font-medium text-quaternary transition-opacity
        duration-150 ease-in-out
      "
    >
      {{ props.label }}
    </span>

    <UIColumnLayout
      align="start"
      gap="xs"
    >
      <slot />
    </UIColumnLayout>
  </div>
</template>
