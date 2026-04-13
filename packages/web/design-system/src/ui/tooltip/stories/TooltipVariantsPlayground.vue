<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import Button from '@/ui/button/button/Button.vue'
import Tooltip from '@/ui/tooltip/Tooltip.vue'
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Large content
      </p>
      <div>
        <Tooltip :popover-side-offset="4">
          <template #trigger>
            <Button label="Hover me" />
          </template>
          <template #content>
            <div class="p-sm">
              <p
                class="
                  flex max-w-xs text-center text-xs font-medium text-secondary
                "
              >
                What a beautiful tooltip!
              </p>
              <p class="mt-xs max-w-xs text-xs text-tertiary">
                Tooltips are used to describe or identify an element.
                In most scenarios, tooltips help the user understand
                meaning, function or alt-text.
              </p>
            </div>
          </template>
        </Tooltip>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With arrow
      </p>
      <div>
        <Tooltip
          :is-popover-arrow-visible="true"
          :popover-side-offset="4"
        >
          <template #trigger>
            <Button label="Hover me" />
          </template>
          <template #content>
            <div class="flex px-sm py-xs">
              <p class="flex max-w-xs text-center text-xs text-secondary">
                Tooltip with arrow
              </p>
            </div>
          </template>
        </Tooltip>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Disabled
      </p>
      <div>
        <Tooltip
          :is-disabled="true"
          :popover-side-offset="4"
        >
          <template #trigger>
            <Button label="Hover me (no tooltip)" />
          </template>
          <template #content>
            <div class="flex px-sm py-xs">
              <p class="flex max-w-xs text-center text-xs text-secondary">
                You should not see this
              </p>
            </div>
          </template>
        </Tooltip>
      </div>
    </div>
  </div>
</template>
