<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem,
} from 'reka-ui'

import RowLayout from '@/ui/row-layout/RowLayout.vue'
import { UIText } from '@/ui/text/index'

const props = defineProps<{
  hint?: string | null
  label: string
  value: string
}>()
</script>

<template>
  <DropdownMenuRadioItem
    :value="props.value"
    class="
      flex min-h-8 w-full cursor-default items-center rounded-sm px-md py-sm
      text-primary duration-100 outline-none
      data-highlighted:bg-tertiary
    "
  >
    <RowLayout
      justify="between"
      class="w-full"
    >
      <RowLayout gap="sm">
        <slot name="left" />

        <UIText
          :text="props.label"
          class="text-sm"
        />

        <UIText
          v-if="props.hint"
          :text="props.hint"
          class="text-sm text-tertiary"
        />
      </RowLayout>

      <DropdownMenuItemIndicator>
        <CheckIcon
          class="size-3.5 text-tertiary"
        />
      </DropdownMenuItemIndicator>
    </RowLayout>
  </DropdownMenuRadioItem>
</template>
