<script setup lang="ts">
import Button from '@/components/button/default-button/Button.vue'
import ConfigProvider from '@/components/config-provider/ConfigProvider.vue'
import DropdownMenu from '@/components/dropdown-menu/DropdownMenu.vue'
import DropdownMenuGroup from '@/components/dropdown-menu/parts/DropdownMenuGroup.vue'
import DropdownMenuItem from '@/components/dropdown-menu/parts/DropdownMenuItem.vue'
import DropdownMenuSeparator from '@/components/dropdown-menu/parts/DropdownMenuSeparator.vue'
import DropdownMenuSubMenu from '@/components/dropdown-menu/parts/DropdownMenuSubMenu.vue'
</script>

<template>
  <Story name="DropdownMenu">
    <ConfigProvider
      locale="en-US"
      teleport-target-selector="#hier"
    >
      <DropdownMenu
        popover-side="right"
        popover-align="start"
      >
        <template #trigger>
          <Button>Trigger</Button>
        </template>

        <template #content>
          <div class="min-w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem
                label="Profile"
                icon="plus"
              />
              <DropdownMenuItem
                label="Settings"
                icon="search"
              />
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuSubMenu label="Assign to">
                <DropdownMenuGroup class="min-w-40">
                  <DropdownMenuItem label="John" />

                  <DropdownMenuItem
                    label="Rick"
                    @select="console.log('rick')"
                  />

                  <DropdownMenuItem
                    :is-disabled="true"
                    label="Tommy"
                  />
                </DropdownMenuGroup>
              </DropdownMenuSubMenu>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                :is-destructive="true"
                icon="calendarIcon"
                label="Logout"
              >
                <template #right>
                  <div class="flex gap-xs text-xs">
                    <span
                      class="
                        flex size-5 items-center justify-center rounded-xs
                        bg-error-primary text-error-primary duration-200
                        group-data-highlighted/dropdown-menu-item:bg-error-secondary
                      "
                    >
                      ⌘
                    </span>

                    <span
                      class="
                        flex size-5 items-center justify-center rounded-xs
                        bg-error-primary text-error-primary duration-200
                        group-data-highlighted/dropdown-menu-item:bg-error-secondary
                      "
                    >
                      K
                    </span>
                  </div>
                </template>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>
        </template>
      </DropdownMenu>

      <div id="hier" />
    </ConfigProvider>
  </Story>
</template>
