<script setup lang="ts">
import { ref } from 'vue'

import RadioGroup from '@/components/radio-group/RadioGroup.vue'
import RadioGroupItem from '@/components/radio-group-item/RadioGroupItem.vue'

const value = ref<string | null>(null)
</script>

<template>
  <Story title="Radio Group">
    <RadioGroup
      v-model="value"
      label="Group"
    >
      <div class="flex flex-col gap-y-md">
        <RadioGroupItem
          value="1"
          label="Option 1"
          hint="This is a hint"
        />

        <RadioGroupItem
          value="2"
          label="Option 2"
        />

        <RadioGroupItem
          value="3"
          label="Option 3"
        />
      </div>
    </RadioGroup>
  </Story>
</template>
