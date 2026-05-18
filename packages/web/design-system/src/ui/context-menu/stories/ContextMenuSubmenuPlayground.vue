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
  UIContextMenuItem,
  UIContextMenuSeparator,
  UIContextMenuSub,
  UIContextMenuSubContent,
  UIContextMenuSubTrigger,
} from '@/ui/context-menu'
</script>

<template>
  <div class="flex items-center justify-center p-xl">
    <UIContextMenu>
      <template #trigger>
        <div
          class="
            flex h-32 w-64 items-center justify-center rounded-md border
            border-dashed border-secondary text-sm text-secondary
          "
        >
          Right-click here
        </div>
      </template>

      <template #content>
        <UIContextMenuGroup>
          <UIContextMenuItem
            :config="{ left: { icon: User01Icon,
                               type: 'icon' } }"
            label="View Profile"
            @select="() => console.log('View Profile')"
          />
        </UIContextMenuGroup>

        <UIContextMenuSeparator />

        <UIContextMenuGroup>
          <UIContextMenuSub>
            <UIContextMenuSubTrigger
              :config="{ left: { icon: Settings01Icon,
                                 type: 'icon' } }"
              label="Settings"
            />
            <UIContextMenuSubContent>
              <UIContextMenuGroup>
                <UIContextMenuItem
                  label="Account"
                  @select="() => console.log('Account')"
                />
                <UIContextMenuItem
                  label="Notifications"
                  @select="() => console.log('Notifications')"
                />
                <UIContextMenuItem
                  label="Privacy"
                  @select="() => console.log('Privacy')"
                />
              </UIContextMenuGroup>
            </UIContextMenuSubContent>
          </UIContextMenuSub>

          <UIContextMenuSub>
            <UIContextMenuSubTrigger
              :config="{ left: { icon: File05Icon,
                                 type: 'icon' } }"
              label="Export"
            />
            <UIContextMenuSubContent>
              <UIContextMenuGroup>
                <UIContextMenuItem
                  label="Export as CSV"
                  @select="() => console.log('Export as CSV')"
                />
                <UIContextMenuItem
                  label="Export as PDF"
                  @select="() => console.log('Export as PDF')"
                />
                <UIContextMenuItem
                  label="Export as JSON"
                  @select="() => console.log('Export as JSON')"
                />
              </UIContextMenuGroup>
            </UIContextMenuSubContent>
          </UIContextMenuSub>
        </UIContextMenuGroup>

        <UIContextMenuSeparator />

        <UIContextMenuGroup>
          <UIContextMenuItem
            :config="{ left: { icon: Trash01Icon,
                               type: 'icon' } }"
            label="Delete"
            @select="() => console.log('Delete')"
          />
        </UIContextMenuGroup>
      </template>
    </UIContextMenu>
  </div>
</template>
