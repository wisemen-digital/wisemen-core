<script setup lang="ts">
import {
  Globe01Icon,
  Phone01Icon,
} from '@wisemen/vue-core-icons'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import type { Component } from 'vue'
import { computed } from 'vue'

import type { DataTableContactInfoCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableContactInfoCell>()

interface ContactInfoRow {
  icon: Component
  key: string
  values: string[]
}

function toList(value: string | string[] | undefined): string[] {
  if (value === undefined) {
    return []
  }

  return Array.isArray(value)
    ? value
    : [
        value,
      ]
}

function formatPhoneNumber(value: string): string {
  return parsePhoneNumberFromString(value)?.formatInternational() ?? value
}

const rows = computed<ContactInfoRow[]>(() => [
  {
    icon: Phone01Icon,
    key: 'phoneNumber',
    values: toList(props.phoneNumber).map(formatPhoneNumber),
  },
  {
    icon: Globe01Icon,
    key: 'website',
    values: toList(props.website),
  },
].filter((row) => row.values.length > 0))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-xxs">
    <div
      v-for="row of rows"
      :key="row.key"
      class="flex min-w-0 items-center gap-xs"
    >
      <Component
        :is="row.icon"
        class="size-3 shrink-0 text-fg-quaternary"
      />

      <span class="truncate text-xs text-primary">
        {{ row.values.join(', ') }}
      </span>
    </div>
  </div>
</template>
