<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import {
  Copy01Icon,
  Globe01Icon,
  Mail01Icon,
  Phone01Icon,
  PhoneCall01Icon,
  Send01Icon,
} from '@wisemen/vue-core-icons'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import type { Component } from 'vue'
import {
  computed,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { UIIconButton } from '@/ui/button'
import DataTableCellHoverPopover from '@/ui/data-table/components/DataTableCellHoverPopover.vue'
import type { DataTableContactInfoCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableContactInfoCell>()

const i18n = useI18n()
const clipboard = useClipboard()

type ContactInfoChannel = 'email' | 'phoneNumber' | 'website'

interface ContactInfoRow {
  channel: ContactInfoChannel
  icon: Component
  label: string
  openHref: ((value: string) => string) | null
  openIcon: Component | null
  openLabel: string
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

const rows = computed<ContactInfoRow[]>(() => ([
  {
    channel: 'phoneNumber',
    icon: Phone01Icon,
    label: i18n.t('component.data_table.cell_contact_info.phone_number_label'),
    openHref: (value: string): string => `tel:${value}`,
    openIcon: PhoneCall01Icon,
    openLabel: i18n.t('component.data_table.cell_contact_info.call_label'),
    values: toList(props.phoneNumber).map(formatPhoneNumber),
  },
  {
    channel: 'email',
    icon: Mail01Icon,
    label: i18n.t('component.data_table.cell_contact_info.email_label'),
    openHref: (value: string): string => `mailto:${value}`,
    openIcon: Send01Icon,
    openLabel: i18n.t('component.data_table.cell_contact_info.send_email_label'),
    values: toList(props.email),
  },
  {
    channel: 'website',
    icon: Globe01Icon,
    label: i18n.t('component.data_table.cell_contact_info.website_label'),
    openHref: null,
    openIcon: null,
    openLabel: '',
    values: toList(props.website),
  },
] satisfies ContactInfoRow[]).filter((row) => row.values.length > 0))

const openPopoverChannel = ref<ContactInfoChannel | null>(null)

function isPopoverOpen(channel: ContactInfoChannel): boolean {
  return openPopoverChannel.value === channel
}

function setPopoverOpen(channel: ContactInfoChannel, isOpen: boolean): void {
  openPopoverChannel.value = isOpen ? channel : null
}

const copyLabel = computed<string>(() => (
  clipboard.copied.value
    ? i18n.t('component.data_table.cell_contact_info.copied_label')
    : i18n.t('component.data_table.cell_contact_info.copy_label')
))

function onCopy(value: string): void {
  clipboard.copy(value)
}

function onOpen(row: ContactInfoRow, value: string): void {
  if (row.openHref === null) {
    return
  }

  window.location.href = row.openHref(value)
}
</script>

<template>
  <div
    v-if="rows.length > 0"
    class="flex min-w-0 items-center gap-xs"
  >
    <DataTableCellHoverPopover
      v-for="row of rows"
      :key="row.channel"
      :is-open="isPopoverOpen(row.channel)"
      popover-side="bottom"
      popover-align="start"
      @update:is-open="(value) => setPopoverOpen(row.channel, value)"
    >
      <template #trigger>
        <button
          :aria-label="row.label"
          class="
            pointer-events-auto flex size-6 shrink-0 items-center justify-center
            rounded-md text-fg-quaternary
            hover:bg-primary-hover hover:text-fg-secondary
          "
          type="button"
        >
          <Component
            :is="row.icon"
            class="size-3"
          />
        </button>
      </template>

      <template #content>
        <div class="flex max-w-64 flex-col divide-y divide-secondary">
          <div
            v-for="value of row.values"
            :key="value"
            class="flex items-center gap-md px-sm py-xs"
          >
            <span class="min-w-0 truncate text-xs text-primary">
              {{ value }}
            </span>

            <div class="flex shrink-0 items-center gap-xxs">
              <UIIconButton
                v-if="row.openHref !== null"
                :icon="row.openIcon!"
                :label="row.openLabel"
                size="xs"
                variant="tertiary"
                @click="onOpen(row, value)"
              />

              <UIIconButton
                :icon="Copy01Icon"
                :label="copyLabel"
                size="xs"
                variant="tertiary"
                @click="onCopy(value)"
              />
            </div>
          </div>
        </div>
      </template>
    </DataTableCellHoverPopover>
  </div>
</template>
