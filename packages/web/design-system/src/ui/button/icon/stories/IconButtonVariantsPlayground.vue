<script setup lang="ts">
import { Settings01Icon } from '@wisemen/vue-core-icons'

import IconButton from '@/ui/button/icon/IconButton.vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <IconButton
        :icon="Settings01Icon"
        label="Settings"
        variant="primary"
      />
      <IconButton
        :icon="Settings01Icon"
        label="Settings"
        variant="secondary"
      />
      <IconButton
        :icon="Settings01Icon"
        label="Settings"
        variant="tertiary"
      />
    </div>
    <div class="flex items-center gap-2">
      <IconButton
        :icon="Settings01Icon"
        label="Delete"
        variant="destructive-primary"
      />
      <IconButton
        :icon="Settings01Icon"
        label="Delete"
        variant="destructive-tertiary"
      />
    </div>
  </div>
</template>
