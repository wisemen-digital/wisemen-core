<script setup lang="ts">
import { ref } from 'vue'

import SelectItem from '@/components/select/parts/SelectItem.vue'
import Select from '@/components/select/Select.vue'

const value = ref<string | null>(null)
const arrayValue = ref<string[]>([
  'First item',
  'Second item',
])
const items = Array.from(Array.from({
  length: 2000,
}), (_, i) => `${i + 1}`)
</script>

<template>
  <Story title="Select">
    <Variant title="Default">
      <Select
        v-model="value"
        :display-fn="(v) => v"
        :filter="{
          isEnabled: true,
          isInline: true,
        }"
        class="w-72"
      >
        <SelectItem value="First item">
          First item
        </SelectItem>

        <SelectItem value="Second item">
          Second item
        </SelectItem>

        <SelectItem value="Third item">
          Third item
        </SelectItem>
      </Select>
    </Variant>

    <Variant title="Multiple">
      <Select
        v-model="arrayValue"
        :display-fn="(v) => v"
        :filter="{
          isEnabled: true,
          isInline: false,
        }"
        placeholder="Multiple"
        class="w-72"
      >
        <SelectItem value="First item">
          First item
        </SelectItem>

        <SelectItem value="Second itemm">
          Second item
        </SelectItem>

        <SelectItem value="Third item">
          Third item
        </SelectItem>

        <SelectItem value="Fourth item">
          Fourth item
        </SelectItem>
      </Select>
    </Variant>

    <Variant title="Virtual list">
      <Select
        v-model="value"
        :display-fn="(v) => v"
        :filter="{
          isEnabled: true,
          isInline: true,
        }"
        :virtual-list="{
          isEnabled: true,
          items,
        }"
        class="w-72"
      />
    </Variant>
  </Story>
</template>
