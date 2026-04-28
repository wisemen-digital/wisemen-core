<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import Button from '@/ui/button/button/Button.vue'
import { UIDropdownMenu } from '@/ui/dropdown-menu'
import type { DropdownMenuItem } from '@/ui/dropdown-menu/dropdownMenuItem.type'

const status = ref('all')
const tags = ref<{
  backend: boolean
  design: boolean
  frontend: boolean
}>({
  backend: false,
  design: false,
  frontend: true,
})

const items = computed<DropdownMenuItem[]>(() => [
  {
    items: [
      {

        items: [
          {
            label: 'All',
            value: 'all',
          },
          {
            label: 'Active',
            value: 'active',
          },
          {
            label: 'Inactive',
            value: 'inactive',
          },

        ],
        type: 'radio-group',
        value: status.value,
        onChange: (v) => (status.value = v),
      },
    ],
    label: 'Radio group',
    type: 'group',
  },
  {
    type: 'separator',
  },
  {
    items: [
      {
        checked: tags.value.frontend,
        label: 'Frontend',
        type: 'checkbox',
        onChange: (v: boolean): void => (
          tags.value.frontend = v
        ),
      },
      {
        checked: tags.value.backend,
        label: 'Backend',
        type: 'checkbox',
        onChange: (v) => (tags.value.backend = v),
      },
      {
        checked: tags.value.design,
        label: 'Design',
        type: 'checkbox',
        onChange: (v) => (tags.value.design = v),
      },
    ],
    label: 'Checkboxes',
    type: 'group',
  },

])
</script>

<template>
  <div class="flex items-center justify-center p-xl">
    <UIDropdownMenu :items="items">
      <template #trigger>
        <Button label="Filter" />
      </template>
    </UIDropdownMenu>
  </div>
</template>
