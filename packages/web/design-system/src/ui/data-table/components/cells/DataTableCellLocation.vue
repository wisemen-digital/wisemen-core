<script setup lang="ts">
import { LinkExternal01Icon } from '@wisemen/vue-core-icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { UILink } from '@/ui/button'
import DataTableCellHoverPopover from '@/ui/data-table/components/DataTableCellHoverPopover.vue'
import type { DataTableLocationCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableLocationCell>()

const i18n = useI18n()

const displayValue = computed<string>(() => {
  if (props.value === null) {
    return ''
  }

  const {
    city,
    country,
    street,
    streetNumber,
  } = props.value

  switch (props.precision) {
    case 'country':
      return country
    case 'municipality':
      return city
    default:
      return [
        street,
        streetNumber,
      ].filter(Boolean).join(' ')
  }
})

const fullAddressLines = computed<string[]>(() => {
  if (props.value === null) {
    return []
  }

  const {
    bus,
    city,
    country,
    postalCode,
    street,
    streetNumber,
  } = props.value

  const streetLine = [
    street,
    streetNumber,
    bus,
  ].filter(Boolean).join(' ')

  const cityLine = [
    postalCode,
    city,
  ].filter(Boolean).join(' ')

  return [
    streetLine,
    cityLine,
    country,
  ].filter((line) => line !== '')
})

const googleMapsHref = computed<string | null>(() => {
  const {
    lat, lng,
  } = props.value?.coordinates ?? {
    lat: null,
    lng: null,
  }

  if (lat === null || lng === null) {
    return null
  }

  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
})
</script>

<template>
  <DataTableCellHoverPopover
    v-if="props.value !== null"
    popover-side="bottom"
    popover-align="start"
  >
    <template #trigger>
      <button
        class="
          pointer-events-auto max-w-full truncate rounded-md px-xs py-xxs
          text-left text-xs text-primary
          hover:bg-primary-hover
        "
        type="button"
      >
        {{ displayValue }}
      </button>
    </template>

    <template #content>
      <div class="flex max-w-64 flex-col gap-sm p-md">
        <div class="flex flex-col gap-none">
          <span
            v-for="line of fullAddressLines"
            :key="line"
            class="text-xs text-primary"
          >
            {{ line }}
          </span>
        </div>

        <UILink
          v-if="googleMapsHref !== null"
          :icon-left="LinkExternal01Icon"
          :label="i18n.t('component.data_table.cell_location.open_in_google_maps_label')"
          :link="{
            href: googleMapsHref,
            target: '_blank',
            rel: 'noopener',
          }"
          size="xs"
          variant="secondary"
        />
      </div>
    </template>
  </DataTableCellHoverPopover>

  <span
    v-else
    class="truncate text-xs text-primary"
  >
    {{ displayValue }}
  </span>
</template>
