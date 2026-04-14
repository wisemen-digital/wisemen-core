<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import Link from '@/ui/button/link/Link.vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With tooltip
      </p>
      <div>
        <Link
          :link="{ href: '#' }"
          label="Hover me"
          tooltip-label="This is a helpful tooltip"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With keyboard shortcut
      </p>
      <div>
        <Link
          :link="{ href: '#' }"
          keyboard-shortcut="⌘D"
          label="Dashboard"
        />
      </div>
    </div>
  </div>
</template>
