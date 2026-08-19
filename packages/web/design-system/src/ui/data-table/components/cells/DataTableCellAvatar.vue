<script setup lang="ts">
import { UIAvatar } from '@/ui/avatar/index'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import DataTableCellEmptyValue from '@/ui/data-table/components/cells/DataTableCellEmptyValue.vue'
import type { DataTableAvatarCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableAvatarCell>()
</script>

<template>
  <DataTableCellEmptyValue
    v-if="props.label === null"
    :value="props.fallback"
  />
  <!-- `xs` keeps the avatar inside the 40px row; the label/supporting text render at the
       table's own `text-xs`, not bold — `UIAvatarLabel`'s `font-semibold` name is meant for
       profile-header contexts, not a dense data cell. -->
  <div
    v-else
    class="flex min-w-0 items-center gap-md"
  >
    <UIAvatar
      :name="props.label"
      :src="props.avatarUrl ?? null"
      size="xs"
    />

    <ColumnLayout
      class="min-w-0"
      gap="none"
    >
      <span class="truncate text-xs text-primary">
        {{ props.label }}
      </span>

      <span
        v-if="props.supportingText != null"
        class="truncate text-xs text-tertiary"
      >
        {{ props.supportingText }}
      </span>
    </ColumnLayout>
  </div>
</template>
