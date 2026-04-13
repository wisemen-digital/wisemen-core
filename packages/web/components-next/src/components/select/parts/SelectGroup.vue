<script setup lang="ts">
import { ListboxGroup as RekaListboxGroup } from 'reka-ui'
import {
  onBeforeUnmount,
  onMounted,
  useId,
} from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectSelectContext } from '@/components/select/select.context'
import { useProvideSelectGroupContext } from '@/components/select/selectGroup.context'

const {
  allGroups,
  classConfig,
  customClassConfig,
  filteredGroups,
  style,
} = useInjectSelectContext()

const id = useId()

onMounted(() => {
  if (allGroups.value.has(id)) {
    return
  }

  allGroups.value.set(id, new Set())
})

onBeforeUnmount(() => {
  allGroups.value.delete(id)
})

const context = useProvideSelectGroupContext({
  id,
  labelId: '',
})
</script>

<template>
  <RekaListboxGroup
    :hidden="!filteredGroups.has(id)"
    :aria-labelledby="context.labelId"
    :class="style.group({
      class: mergeClasses(customClassConfig.group, classConfig?.group),
    })"
  >
    <slot />
  </RekaListboxGroup>
</template>
