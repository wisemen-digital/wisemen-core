<script setup lang="ts">
import { Settings01Icon } from '@wisemen/vue-core-icons'

import IconButton from '@/ui/button/icon/IconButton.vue'
</script>

<template>
  <div class="flex items-center gap-2">
    <IconButton
      :icon="Settings01Icon"
      label="Extra Small"
      size="xs"
    />
    <IconButton
      :icon="Settings01Icon"
      label="Small"
      size="sm"
    />
    <IconButton
      :icon="Settings01Icon"
      label="Medium"
      size="md"
    />
    <IconButton
      :icon="Settings01Icon"
      label="Large"
      size="lg"
    />
  </div>
</template>
