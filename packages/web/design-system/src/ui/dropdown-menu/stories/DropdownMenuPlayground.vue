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
    avatar: {
      name: 'Jeroen',
      src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    description: 'jeroen.vc1@icloud.com',
    label: 'Jeroen VC',
    type: 'item',
    onSelect: () => console.log('New file'),
  },
  {
    type: 'separator',
  },
  {
    icon: User01Icon,
    label: 'View Profile',
    right: {
      keys: 'meta_k',
      type: 'shortcut',
    },
    type: 'item',
    onSelect: () => console.log('Profile'),
  },
  {
    icon: Settings01Icon,
    label: 'View Profile',
    type: 'item',
    onSelect: () => console.log('Profile'),
  },
  {
    type: 'separator',
  },
  {
    icon: File05Icon,
    label: 'Export',
    type: 'item',
    onSelect: () => console.log('Export'),
  },
  {
    type: 'separator',
  },
  {
    disabledReason: null,
    icon: Trash01Icon,
    label: 'Delete',
    type: 'item',
    onSelect: () => console.log('Delete'),
  },
]
</script>

<template>
  <div class="flex items-center justify-center p-xl">
    <UIDropdownMenu :items="items">
      <template #trigger>
        <Button label="Open menu" />
      </template>
    </UIDropdownMenu>
  </div>
</template>
