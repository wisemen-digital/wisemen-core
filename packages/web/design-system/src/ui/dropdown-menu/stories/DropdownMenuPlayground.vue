<script setup lang="ts">
import {
  File05Icon,
  Settings01Icon,
  Trash01Icon,
  User01Icon,
} from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button'
import {
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuHeader,
  UIDropdownMenuItem,
  UIDropdownMenuSeparator,
} from '@/ui/dropdown-menu'
</script>

<template>
  <div class="flex items-center justify-center p-xl">
    <UIDropdownMenu>
      <template #trigger>
        <UIButton label="Open menu" />
      </template>

      <template #content>
        <UIDropdownMenuGroup>
          <UIDropdownMenuHeader title="Account" />

          <UIDropdownMenuItem
            :config="{
              avatar: {
                name: 'Jeroen',
                src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
              },
              descriptionLayout: 'inline',
              description: 'jeroen.vc1@icloud.com',
            }"
            label="Jeroen VC"
            @select="() => console.log('Profile')"
          />
        </UIDropdownMenuGroup>

        <UIDropdownMenuSeparator />

        <UIDropdownMenuGroup>
          <UIDropdownMenuHeader title="Account" />
          <UIDropdownMenuItem
            :config="{
              icon: User01Icon,
              right: {
                keyboardShortcut: {
                  key: 'K',
                  meta: true,
                },
                type: 'shortcut',
              },
            }"
            label="View Profile"
            @select="() => console.log('Profile')"
          />

          <UIDropdownMenuItem
            :config="{ icon: Settings01Icon }"
            label="Settings"
            @select="() => console.log('Settings')"
          />
        </UIDropdownMenuGroup>

        <UIDropdownMenuSeparator />

        <UIDropdownMenuGroup>
          <UIDropdownMenuItem
            :config="{ icon: File05Icon }"
            label="Export"
            @select="() => console.log('Export')"
          />
        </UIDropdownMenuGroup>

        <UIDropdownMenuSeparator />

        <UIDropdownMenuGroup>
          <UIDropdownMenuItem
            :config="{ icon: Trash01Icon }"
            label="Delete"
            disabled-reason="You don't have permission to delete"
            @select="() => console.log('Delete')"
          />
        </UIDropdownMenuGroup>
      </template>
    </UIDropdownMenu>
  </div>
</template>
