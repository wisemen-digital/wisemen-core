<script setup lang="ts">
import { ref } from 'vue'

import Switch from '@/ui/switch/Switch.vue'

const mdValue = ref<boolean>(true)
const smValue = ref<boolean>(true)
</script>

<template>
  <div class="flex flex-wrap items-start gap-4">
    <Switch
      v-model="mdValue"
      label="Medium (md)"
      size="md"
    />
    <Switch
      v-model="smValue"
      label="Small (sm)"
      size="sm"
    />
  </div>
</template>
