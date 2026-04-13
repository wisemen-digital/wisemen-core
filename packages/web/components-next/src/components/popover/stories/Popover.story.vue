<script setup lang="ts">
import Button from '@/components/button/default-button/Button.vue'
import Popover from '@/components/popover/Popover.vue'
</script>

<template>
  <Story title="Popover">
    <Popover popover-align="end">
      <template #trigger>
        <Button>
          Label
        </Button>
      </template>

      <template #content>
        <div class="h-40 w-80" />
      </template>
    </Popover>
  </Story>
</template>
