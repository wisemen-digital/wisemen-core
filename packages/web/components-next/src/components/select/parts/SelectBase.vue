<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import SelectBaseInlineSearch from '@/components/select/parts/SelectBaseInlineSearch.vue'
import SelectBaseMultiple from '@/components/select/parts/SelectBaseMultiple.vue'
import SelectBaseSingle from '@/components/select/parts/SelectBaseSingle.vue'
import { useInjectSelectContext } from '@/components/select/select.context'

const {
  hasInlineSearchInput,
  isMultiple,
  classConfig,
  customClassConfig,
  style,
} = useInjectSelectContext()
</script>

<template>
  <div
    :class="style.base({
      class: mergeClasses(customClassConfig.base, classConfig?.base),
    })"
  >
    <slot>
      <SelectBaseInlineSearch v-if="hasInlineSearchInput" />

      <SelectBaseMultiple v-else-if="isMultiple">
        <template #badge="{ value }">
          <slot
            :value="value"
            name="badge"
          />
        </template>
      </SelectBaseMultiple>

      <SelectBaseSingle v-else />
    </slot>
  </div>
</template>
