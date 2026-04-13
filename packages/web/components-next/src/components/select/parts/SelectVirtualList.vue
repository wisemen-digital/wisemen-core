<script setup lang="ts">
import { ListboxVirtualizer as RekaListboxVirtualizer } from 'reka-ui'

import SelectItem from '@/components/select/parts/SelectItem.vue'
import { useInjectSelectContext } from '@/components/select/select.context'

const {
  displayFn,
  virtualList,
  virtualListFilteredItems,
} = useInjectSelectContext()
</script>

<template>
  <!-- Without the div, the virtual list is bugged when using the item slot -->
  <RekaListboxVirtualizer
    v-if="virtualList !== null && virtualList.isEnabled"
    v-slot="{ option }"
    :options="virtualListFilteredItems"
    :overscan="10"
    :estimate-size="virtualList.optionHeight ?? 39"
    :text-content="displayFn"
  >
    <div class="w-full">
      <slot
        :item="option"
        name="item"
      >
        <SelectItem :value="option">
          {{ displayFn(option) }}
        </SelectItem>
      </slot>
    </div>
  </RekaListboxVirtualizer>
</template>
