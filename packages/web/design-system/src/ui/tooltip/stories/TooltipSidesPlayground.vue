<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import Button from '@/ui/button/button/Button.vue'
import Tooltip from '@/ui/tooltip/Tooltip.vue'
</script>

<template>
  <div class="flex items-center justify-center gap-16 p-32">
    <Tooltip
      :popover-side-offset="4"
      popover-side="top"
    >
      <template #trigger>
        <Button label="Top" />
      </template>
      <template #content>
        <div class="flex px-sm py-xs">
          <p class="text-xs text-secondary">
            Top tooltip
          </p>
        </div>
      </template>
    </Tooltip>

    <Tooltip
      :popover-side-offset="4"
      popover-side="right"
    >
      <template #trigger>
        <Button label="Right" />
      </template>
      <template #content>
        <div class="flex px-sm py-xs">
          <p class="text-xs text-secondary">
            Right tooltip
          </p>
        </div>
      </template>
    </Tooltip>

    <Tooltip
      :popover-side-offset="4"
      popover-side="bottom"
    >
      <template #trigger>
        <Button label="Bottom" />
      </template>
      <template #content>
        <div class="flex px-sm py-xs">
          <p class="text-xs text-secondary">
            Bottom tooltip
          </p>
        </div>
      </template>
    </Tooltip>

    <Tooltip
      :popover-side-offset="4"
      popover-side="left"
    >
      <template #trigger>
        <Button label="Left" />
      </template>
      <template #content>
        <div class="flex px-sm py-xs">
          <p class="text-xs text-secondary">
            Left tooltip
          </p>
        </div>
      </template>
    </Tooltip>
  </div>
</template>
