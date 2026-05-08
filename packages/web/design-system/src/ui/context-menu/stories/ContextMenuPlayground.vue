<script setup lang="ts">
import {
  File05Icon,
  Settings01Icon,
  Trash01Icon,
  User01Icon,
} from '@wisemen/vue-core-icons'

import {
  UIContextMenu,
  UIContextMenuGroup,
  UIContextMenuHeader,
  UIContextMenuItem,
  UIContextMenuSeparator,
} from '@/ui/context-menu'
</script>

<template>
  <div class="flex items-center justify-center p-xl">
    <UIContextMenu>
      <template #trigger>
        <div class="flex h-32 w-64 items-center justify-center rounded-md border border-dashed border-secondary text-sm text-secondary">
          Right-click here
        </div>
      </template>

      <template #content>
        <UIContextMenuGroup>
          <UIContextMenuHeader title="Account" />

          <UIContextMenuItem
            :config="{ icon: User01Icon }"
            label="View Profile"
            @select="() => console.log('Profile')"
          />

          <UIContextMenuItem
            :config="{ icon: Settings01Icon }"
            label="Settings"
            @select="() => console.log('Settings')"
          />
        </UIContextMenuGroup>

        <UIContextMenuSeparator />

        <UIContextMenuGroup>
          <UIContextMenuItem
            :config="{ icon: File05Icon }"
            label="Export"
            @select="() => console.log('Export')"
          />
        </UIContextMenuGroup>

        <UIContextMenuSeparator />

        <UIContextMenuGroup>
          <UIContextMenuItem
            :config="{ icon: Trash01Icon }"
            label="Delete"
            disabled-reason="You don't have permission to delete"
            @select="() => console.log('Delete')"
          />
        </UIContextMenuGroup>
      </template>
    </UIContextMenu>
  </div>
</template>
