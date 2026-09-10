<script setup lang="ts">
import {
  createAction,
  setIsAuthenticated,
} from '@wisemen/vue-core-actions'
import {
  Copy01Icon,
  Edit01Icon,
  Link01Icon,
  Mail01Icon,
  Share07Icon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'

import { UIActionDropdownMenu } from '@/ui/action-dropdown-menu'
import { UIButton } from '@/ui/button'

setIsAuthenticated(true)

const actions = [
  createAction({
    id: 'edit',
    name: 'Edit',
    execute: () => {},
    icon: () => Edit01Icon,
    keyboardShortcut: {
      key: 'E',
      mod: true,
    },
  }),
  createAction({
    id: 'duplicate',
    name: 'Duplicate',
    execute: () => {},
    icon: () => Copy01Icon,
  }),
  createAction({
    id: 'share',
    name: 'Share',
    icon: () => Share07Icon,
    separatorGroup: 'share',
    subActions: () => [
      createAction({
        id: 'share-link',
        name: 'Copy link',
        execute: () => {},
        icon: () => Link01Icon,
      }),
      createAction({
        id: 'share-email',
        name: 'Send via email',
        execute: () => {},
        icon: () => Mail01Icon,
      }),
    ],
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
    <UIActionDropdownMenu
      :actions="actions"
      :is-current-context-only="true"
    >
      <UIButton label="Open menu" />
    </UIActionDropdownMenu>
  </div>
</template>
