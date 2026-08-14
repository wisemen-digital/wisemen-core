<script setup lang="ts">
import { computed } from 'vue'

import { UIAvatarLabel } from '@/ui/avatar/index'
import type { DataTablePersonCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTablePersonCell>()

const displayName = computed<string>(() => props.name ?? '')
</script>

<template>
  <!-- `xs` keeps the avatar inside the 40px row and renders both lines at the table's
       own `text-xs` — see `avatarLabel.style.ts`. -->
  <UIAvatarLabel
    v-if="displayName !== ''"
    :name="displayName"
    :src="props.avatarUrl ?? null"
    :supporting-text="props.supportingText ?? null"
    size="xs"
  />
</template>
