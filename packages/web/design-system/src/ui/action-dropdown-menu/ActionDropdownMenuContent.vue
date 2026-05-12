<script setup lang="ts">
import type {
  Action,
  ActionModel,
} from '@wisemen/vue-core-actions'
import { useActionDropdownMenuContent } from '@wisemen/vue-core-actions'
import { DropdownMenuFilter } from 'reka-ui'
import {
  computed,
  toRef,
  useTemplateRef,
} from 'vue'

import ActionDropdownMenuItem from '@/ui/action-dropdown-menu/ActionDropdownMenuItem.vue'
import { UIColumnLayout } from '@/ui/column-layout/index'
import {
  UIDropdownMenuGroup,
  UIDropdownMenuSeparator,
} from '@/ui/dropdown-menu/index'
import { UISkeletonItem } from '@/ui/skeleton-item/index'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  actions?: Action[]
  metadata?: Record<string, unknown>
  models: ActionModel[]
  parentAction?: Action | null
}>(), {
  actions: () => [],
  parentAction: null,
})

const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainer')

const {
  isLoading,
  actionGroups,
  context,
  placeholder,
  preview,
  searchInput,
  onKeyDown,
} = useActionDropdownMenuContent({
  actions: toRef(props, 'actions'),
  metadata: toRef(props, 'metadata'),
  models: toRef(props, 'models'),
  parentAction: toRef(props, 'parentAction'),
  scrollContainerRef,
})

const isFilterVisible = computed<boolean>(
  () => props.actions.length > 7
    || props.parentAction?.subActions !== undefined
    || props.actions.some(
      (a) => a.subActions !== undefined,
    ),
)
</script>

<template>
  <div class="group/content flex max-h-[inherit] flex-col overflow-hidden">
    <div
      v-if="isFilterVisible"
      class="p-xs pb-none"
    >
      <DropdownMenuFilter
        v-model="searchInput"
        :auto-focus="true"
        :placeholder="placeholder"
        class="
          block w-full rounded-xs bg-secondary px-md py-sm text-xs
          text-secondary duration-100 outline-none
          placeholder:text-placeholder
          group-hover/content:placeholder:text-tertiary
        "
        @keydown="onKeyDown"
        @keydown.enter.stop
      />
    </div>

    <div
      ref="scrollContainer"
      class="max-h-120 scroll-p-1 overflow-y-auto"
    >
      <div
        v-if="isLoading"
        class="p-md"
        role="status"
        aria-live="polite"
      >
        <span class="sr-only">Loading actions</span>

        <UIColumnLayout gap="lg">
          <UISkeletonItem class="h-3 w-40" />
          <UISkeletonItem class="h-3 w-24" />
          <UISkeletonItem class="h-3 w-48" />
          <UISkeletonItem class="h-3 w-32" />
        </UIColumnLayout>
      </div>

      <template v-else-if="actionGroups.length > 0">
        <template
          v-for="(group, groupIndex) of actionGroups"
          :key="groupIndex"
        >
          <UIDropdownMenuSeparator v-if="groupIndex > 0" />
          <UIDropdownMenuGroup>
            <ActionDropdownMenuItem
              v-for="action of group"
              :key="action.id"
              :models="props.models"
              :action="action"
              :context="context"
              :preview="preview"
              :close-on-select="parentAction?.multiSelectSubActions !== true"
            />
          </UIDropdownMenuGroup>
        </template>
      </template>

      <div
        v-else
        class="flex px-lg py-md"
      >
        <UIText
          text="No matching actions"
          class="text-xs text-tertiary"
        />
      </div>
    </div>
  </div>
</template>
