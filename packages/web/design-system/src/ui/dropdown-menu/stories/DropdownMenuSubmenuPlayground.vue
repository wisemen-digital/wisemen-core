<script setup lang="ts">
import {
  File05Icon,
  Settings01Icon,
  Trash01Icon,
  User01Icon,
} from '@wisemen/vue-core-icons'

import Button from '@/ui/button/button/Button.vue'
import {
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuItem,
  UIDropdownMenuSeparator,
  UIDropdownMenuSub,
  UIDropdownMenuSubContent,
  UIDropdownMenuSubTrigger,
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
          <UIDropdownMenuItem
            :config="{ icon: User01Icon }"
            label="View Profile"
            @select="() => console.log('View Profile')"
          />
        </UIDropdownMenuGroup>

        <UIDropdownMenuSeparator />

        <UIDropdownMenuGroup>
          <UIDropdownMenuSub>
            <UIDropdownMenuSubTrigger
              :config="{ icon: Settings01Icon }"
              label="Settings"
            />
            <UIDropdownMenuSubContent>
              <UIDropdownMenuGroup>
                <UIDropdownMenuItem
                  label="Account"
                  @select="() => console.log('Account')"
                />
                <UIDropdownMenuItem
                  label="Notifications"
                  @select="() => console.log('Notifications')"
                />
                <UIDropdownMenuItem
                  label="Privacy"
                  @select="() => console.log('Privacy')"
                />
                <UIDropdownMenuItem
                  label="Security"
                  @select="() => console.log('Security')"
                />
                <UIDropdownMenuItem
                  label="Billing"
                  @select="() => console.log('Billing')"
                />
              </UIDropdownMenuGroup>
            </UIDropdownMenuSubContent>
          </UIDropdownMenuSub>

          <UIDropdownMenuSub>
            <UIDropdownMenuSubTrigger
              :config="{ icon: File05Icon }"
              label="Export"
            />
            <UIDropdownMenuSubContent>
              <UIDropdownMenuGroup>
                <UIDropdownMenuItem
                  label="Export as CSV"
                  @select="() => console.log('Export as CSV')"
                />
                <UIDropdownMenuItem
                  label="Export as PDF"
                  @select="() => console.log('Export as PDF')"
                />
                <UIDropdownMenuItem
                  label="Export as JSON"
                  @select="() => console.log('Export as JSON')"
                />
              </UIDropdownMenuGroup>
            </UIDropdownMenuSubContent>
          </UIDropdownMenuSub>
        </UIDropdownMenuGroup>

        <UIDropdownMenuSeparator />

        <UIDropdownMenuGroup>
          <UIDropdownMenuItem
            :config="{ icon: Trash01Icon }"
            label="Delete"
            @select="() => console.log('Delete')"
          />
        </UIDropdownMenuGroup>
      </template>
    </UIDropdownMenu>
  </div>
</template>
