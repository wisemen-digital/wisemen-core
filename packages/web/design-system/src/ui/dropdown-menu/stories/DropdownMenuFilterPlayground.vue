<script setup lang="ts">
import { ref } from 'vue'

import Button from '@/ui/button/button/Button.vue'
import {
  UIDropdownMenu,
  UIDropdownMenuCheckboxItem,
  UIDropdownMenuGroup,
  UIDropdownMenuHeader,
  UIDropdownMenuRadioGroup,
  UIDropdownMenuRadioItem,
  UIDropdownMenuSeparator,
} from '@/ui/dropdown-menu'

const status = ref('all')
const tags = ref({
  backend: false,
  design: false,
  frontend: true,
})
</script>

<template>
  <div class="flex items-center justify-center p-xl">
    <UIDropdownMenu>
      <template #trigger>
        <Button label="Filter" />
      </template>

      <template #content>
        <UIDropdownMenuGroup>
          <UIDropdownMenuHeader title="Status" />
          <UIDropdownMenuRadioGroup v-model="status">
            <UIDropdownMenuRadioItem
              value="all"
              label="All"
            />
            <UIDropdownMenuRadioItem
              value="active"
              label="Active"
            />
            <UIDropdownMenuRadioItem
              value="inactive"
              label="Inactive"
            />
          </UIDropdownMenuRadioGroup>
        </UIDropdownMenuGroup>

        <UIDropdownMenuSeparator />

        <UIDropdownMenuGroup>
          <UIDropdownMenuHeader title="Tags" />
          <UIDropdownMenuCheckboxItem
            v-model="tags.frontend"
            label="Frontend"
          />
          <UIDropdownMenuCheckboxItem
            v-model="tags.backend"
            label="Backend"
          />
          <UIDropdownMenuCheckboxItem
            v-model="tags.design"
            label="Design"
          />
        </UIDropdownMenuGroup>
      </template>
    </UIDropdownMenu>
  </div>
</template>
