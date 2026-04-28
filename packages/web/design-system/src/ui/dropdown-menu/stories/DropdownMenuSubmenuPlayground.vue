<script setup lang="ts">
import {
  File05Icon,
  Settings01Icon,
  Trash01Icon,
  User01Icon,
} from '@wisemen/vue-core-icons'

import Button from '@/ui/button/button/Button.vue'
import { UIDropdownMenu } from '@/ui/dropdown-menu'
import type { DropdownMenuItem } from '@/ui/dropdown-menu/dropdownMenuItem.type'

const items: DropdownMenuItem[] = [
  {
    icon: User01Icon,
    label: 'View Profile',
    type: 'item',
    onSelect: () => console.log('View Profile'),
  },
  {
    type: 'separator',
  },
  {
    filter: true,
    icon: Settings01Icon,
    items: [
      {
        label: 'Account',
        type: 'item',
        onSelect: () => console.log('Account'),
      },
      {
        label: 'Notifications',
        type: 'item',
        onSelect: () => console.log('Notifications'),
      },
      {
        label: 'Privacy',
        type: 'item',
        onSelect: () => console.log('Privacy'),
      },
      {
        label: 'Security',
        type: 'item',
        onSelect: () => console.log('Security'),
      },
      {
        label: 'Billing',
        type: 'item',
        onSelect: () => console.log('Billing'),
      },
    ],
    label: 'Settings',
    type: 'submenu',
  },
  {
    icon: File05Icon,
    items: [
      {
        label: 'Export as CSV',
        type: 'item',
        onSelect: () => console.log('Export as CSV'),
      },
      {
        label: 'Export as PDF',
        type: 'item',
        onSelect: () => console.log('Export as PDF'),
      },
      {
        label: 'Export as JSON',
        type: 'item',
        onSelect: () => console.log('Export as JSON'),
      },
    ],
    label: 'Export',
    type: 'submenu',
  },
  {
    type: 'separator',
  },
  {
    icon: Trash01Icon,
    label: 'Delete',
    type: 'item',
    onSelect: () => console.log('Delete'),
  },
]
</script>

<template>
  <div class="flex items-center justify-center p-xl">
    <UIDropdownMenu
      :items="items"
      :filter="true"
    >
      <template #trigger>
        <Button label="Open menu" />
      </template>
    </UIDropdownMenu>
  </div>
</template>
