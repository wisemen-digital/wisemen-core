<script setup lang="ts">
import { ref } from 'vue'

import Checkbox from '@/components/checkbox/Checkbox.vue'
import CheckboxGroup from '@/components/checkbox-group/CheckboxGroup.vue'

const value = ref<string[]>([])
</script>

<template>
  <Story title="Checkbox Group">
    <CheckboxGroup
      v-model="value"
      label="Label"
    >
      <Checkbox
        value="1"
        label="First"
      />

      <Checkbox
        value="2"
        label="Second"
      />

      <Checkbox
        value="3"
        label="Third"
      />
    </CheckboxGroup>
  </Story>
</template>
