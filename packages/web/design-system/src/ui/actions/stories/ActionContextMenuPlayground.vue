<script setup lang="ts">
import {
  createAction,
  setIsAuthenticated,
} from '@wisemen/vue-core-actions'
import {
  ArchiveIcon,
  Copy01Icon,
  Edit01Icon,
  FolderIcon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'

import { UIActionContextMenu } from '@/ui/action-context-menu'

setIsAuthenticated(true)

const actions = [
  createAction({
    id: 'rename',
    name: 'Rename',
    execute: () => {},
    icon: () => Edit01Icon,
  }),
  createAction({
    id: 'duplicate',
    name: 'Duplicate',
    execute: () => {},
    icon: () => Copy01Icon,
  }),
  createAction({
    id: 'move',
    name: 'Move to',
    icon: () => FolderIcon,
    separatorGroup: 'move',
    subActions: () => [
      createAction({
        id: 'move-folder-a',
        name: 'Folder A',
        execute: () => {},
      }),
      createAction({
        id: 'move-folder-b',
        name: 'Folder B',
        execute: () => {},
      }),
    ],
  }),
  createAction({
    id: 'archive',
    name: 'Archive',
    execute: () => {},
    icon: () => ArchiveIcon,
    separatorGroup: 'archive',
  }),
  createAction({
    id: 'delete',
    name: 'Delete',
    disabledReason: () => 'You don\'t have permission to delete this item',
    execute: () => {},
    icon: () => Trash01Icon,
    separatorGroup: 'delete',
  }),
]
</script>

<template>
  <div class="flex items-center justify-center p-xl">
    <UIActionContextMenu
      :actions="actions"
      :is-current-context-only="true"
    >
      <div
        class="
          flex h-32 w-64 items-center justify-center rounded-md border
          border-dashed border-secondary text-sm text-secondary
        "
      >
        Right-click here
      </div>
    </UIActionContextMenu>
  </div>
</template>
