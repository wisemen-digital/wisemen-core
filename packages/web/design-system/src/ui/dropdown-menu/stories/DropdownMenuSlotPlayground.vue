<script setup lang="ts">
import {
  File05Icon,
  Settings01Icon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'

import Button from '@/ui/button/button/Button.vue'
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
        <Button label="Open menu" />
      </template>

      <template #content>
        <UIDropdownMenuGroup>
          <UIDropdownMenuHeader title="Actions" />

          <UIDropdownMenuItem
            :config="{
              icon: File05Icon,
            }"
            label="Export"
            @select="() => console.log('Export')"
          />

          <UIDropdownMenuItem
            :config="{
              icon: Settings01Icon,
            }"
            label="Settings"
            @select="() => console.log('Settings')"
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
