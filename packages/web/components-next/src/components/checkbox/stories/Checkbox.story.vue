<script setup lang="ts">
import { ref } from 'vue'

import Checkbox from '@/components/checkbox/Checkbox.vue'

const isChecked = ref<boolean>(false)
</script>

<template>
  <Story title="Checkbox">
    <div>
      <Checkbox
        v-model="isChecked"
        :is-disabled="false"
        :is-indeterminate="false"
        :is-touched="true"
        :errors="['Error, something went wrong']"
        label="Label"
        hint="Hint"
      />
    </div>
  </Story>
</template>
