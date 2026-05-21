<script setup lang="ts">
import { XCloseIcon } from '@wisemen/vue-core-icons'
import {
  TagsInputItem as RekaTagsInputItem,
  TagsInputItemDelete as RekaTagsInputItemDelete,
  TagsInputItemText as RekaTagsInputItemText,
} from 'reka-ui'

const props = defineProps<{
  isDisabled?: boolean
  isReadonly?: boolean
  value: string
}>()
</script>

<template>
  <RekaTagsInputItem
    :value="props.value"
    class="
      inline-flex h-5 shrink-0 items-center gap-sm rounded-sm border
      border-gray-200 bg-gray-25 px-xs
      aria-current:bg-tertiary/80
      dark:border-gray-800 dark:bg-gray-950
    "
  >
    <RekaTagsInputItemText
      class="
        max-w-xs truncate text-xxs font-medium text-gray-700
        dark:text-gray-300
      "
    />

    <RekaTagsInputItemDelete
      v-if="!props.isDisabled && !props.isReadonly"
      aria-label="Remove tag"
      class="
        flex items-center text-gray-400 outline-none
        hover:text-gray-600
        dark:text-gray-500
        dark:hover:text-gray-300
      "
    >
      <XCloseIcon class="size-3" />
    </RekaTagsInputItemDelete>
  </RekaTagsInputItem>
</template>
