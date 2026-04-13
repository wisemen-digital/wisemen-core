<script setup lang="ts">
import Button from '@/components/button/default-button/Button.vue'
import Tooltip from '@/components/tooltip/Tooltip.vue'
</script>

<template>
  <Story title="Tooltip">
    <Tooltip>
      <template #trigger>
        <Button>
          Label
        </Button>
      </template>

      <template #content>
        <div class="px-md py-xs text-sm">
          <span class="text-primary">Tooltip content</span>
        </div>
      </template>
    </Tooltip>
  </Story>
</template>
