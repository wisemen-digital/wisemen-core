<script setup lang="ts">
import { useKeyHold } from '@tanstack/vue-hotkeys'
import type {
  Action,
  NavFrame,
} from '@wisemen/vue-core-actions'
import {
  buildCommandMenuGroups,
  useActionManagerStore,
  useActionRegistryStore,
  useCommandMenuActions,
  useCommandMenuAnimation,
  useCommandMenuNavigation,
} from '@wisemen/vue-core-actions'
import { ChevronRightIcon } from '@wisemen/vue-core-icons'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogRoot,
  DialogTitle,
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxRoot,
} from 'reka-ui'
import {
  computed,
  ref,
  useTemplateRef,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { UIBadge } from '@/ui/badge/index'
import CommandMenuActionItem from '@/ui/command-menu/CommandMenuActionItem.vue'
import CommandMenuLoadingSkeleton from '@/ui/command-menu/CommandMenuLoadingSkeleton.vue'
import { UIRowLayout } from '@/ui/row-layout/index'
import { UIText } from '@/ui/text/index'

const props = defineProps<{
  action?: Action
}>()

const emit = defineEmits<{
  afterLeave: []
  close: []
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
})

const manager = useActionManagerStore()
const registry = useActionRegistryStore()

const actionsSnapshot = registry.allActions()
const focusedModelsSnapshot = manager.focusedModels

const i18n = useI18n()
const listboxRootRef = useTemplateRef('listboxRoot')
const listboxContentRef = useTemplateRef('listboxContent')
const isShiftKeyHeld = useKeyHold('Shift')

const navStack = ref<NavFrame[]>([])
const searchInput = ref('')

const {
  isLoadingActions,
  buildContext,
  refreshActions,
  resolvedActions,
  subActionsMetaMap,
} = useCommandMenuActions({
  actionsSnapshot,
  focusedModelsSnapshot,
  listboxContentRef: listboxContentRef as any,
  listboxRootRef: listboxRootRef as any,
  manager,
  navStack,
  searchInput,
})

const {
  highlightedActionId,
  activateAction,
  breadcrumbs,
  currentParent,
  placeholder,
  preview,
  onKeyDown,
} = useCommandMenuNavigation({
  isShiftKeyHeld,
  buildContext,
  emit,
  listboxRootRef: listboxRootRef as any,
  manager,
  navStack,
  refreshActions,
  resolvedActions,
  scrollToTopOfGroup,
  searchInput,
  subActionsMetaMap,
})

const {
  hasNavigated, isBouncing,
} = useCommandMenuAnimation(isOpen, () => navStack.value.length)

const groups = computed(() => buildCommandMenuGroups(resolvedActions.value, buildContext()))

if (props.action !== undefined) {
  activateAction(props.action)
}

refreshActions()

function scrollToTopOfGroup(): void {
  const highlightedItemId = (listboxRootRef.value as any)?.highlightedElement?.getAttribute('data-id') ?? null

  if (highlightedItemId === null) {
    return
  }

  const contentEl = (listboxContentRef.value as any)?.$el as HTMLElement | undefined

  if (contentEl === undefined) {
    return
  }

  const highlightedEl = contentEl.querySelector(`[data-id="${CSS.escape(highlightedItemId)}"]`) as HTMLElement | null

  if (highlightedEl === null) {
    return
  }

  const containerRect = contentEl.getBoundingClientRect()
  const groupEl = highlightedEl.closest('[role="group"]') as HTMLElement | null

  if (groupEl === null || groupEl.querySelector('[data-id]') !== highlightedEl) {
    return
  }

  const targetRect = groupEl.getBoundingClientRect()
  const targetTop = targetRect.top - containerRect.top + contentEl.scrollTop

  if (targetTop < contentEl.scrollTop) {
    contentEl.scrollTo({
      behavior: 'instant',
      top: targetTop,
    })
  }
}

function onUpdateIsOpen(value: boolean): void {
  if (!value) {
    emit('close')
  }
}
</script>

<template>
  <DialogRoot
    v-model:open="isOpen"
    @update:open="onUpdateIsOpen"
  >
    <DialogContent
      :class="{
        bouncing: isBouncing,
        navigated: hasNavigated,
      }"
      class="
        absolute top-28 left-1/2 z-40 w-full max-w-180 -translate-x-1/2
        rounded-xl border border-transparent bg-primary shadow-lg duration-200
        outline-none
        dark:border-secondary
      "
      data-command-menu
      @after-leave="emit('afterLeave')"
    >
      <DialogTitle class="sr-only">
        {{ i18n.t('component.command_menu.title') }}
      </DialogTitle>
      <DialogDescription class="sr-only">
        {{ i18n.t('component.command_menu.title') }}
      </DialogDescription>

      <ListboxRoot
        ref="listboxRoot"
        :highlight-on-hover="true"
        class="flex flex-col overflow-hidden"
        @highlight="(payload) => highlightedActionId = (payload?.value as string) ?? null"
      >
        <div class="relative flex items-center border-b border-secondary">
          <UIRowLayout
            v-if="breadcrumbs.length > 0 && currentParent?.forceAsRootMenu !== true"
            as="ul"
            gap="xs"
            class="-mr-sm pl-lg"
          >
            <template
              v-for="(breadcrumb, breadcrumbIndex) of breadcrumbs"
              :key="breadcrumbIndex"
            >
              <UIBadge
                :label="breadcrumb"
                size="sm"
              />

              <ChevronRightIcon
                v-if="breadcrumbIndex !== breadcrumbs.length - 1"
                class="size-3 text-tertiary"
              />
            </template>
          </UIRowLayout>

          <ListboxFilter
            v-model="searchInput"
            :placeholder="placeholder"
            class="block w-full px-xl py-lg text-xs text-secondary outline-none"
            @keydown="onKeyDown"
          />
        </div>

        <div
          :class="{
            'grid-cols-2': preview !== null,
          }"
          class="grid"
        >
          <ListboxContent
            :key="resolvedActions.map((a) => a.id).join('')"
            ref="listboxContent"
            class="max-h-96 scroll-p-1 overflow-y-auto outline-none select-none"
            data-content
          >
            <template v-if="resolvedActions.length > 0">
              <ListboxGroup
                v-for="group of groups"
                :key="group.key"
                class="p-xs"
              >
                <ListboxGroupLabel
                  v-if="group.label !== null
                    && (group.showIfOnlyGroup || currentParent === null || groups.length > 1)"
                  class="px-md py-xs"
                >
                  <UIRowLayout>
                    <Component
                      :is="group.icon"
                      v-if="group.icon !== null"
                      class="size-3 text-disabled"
                    />

                    <span class="text-xxs text-disabled">
                      {{ group.label }}
                    </span>
                  </UIRowLayout>
                </ListboxGroupLabel>

                <CommandMenuActionItem
                  v-for="groupAction of group.items"
                  :key="groupAction.id"
                  :action="groupAction"
                  :ctx="buildContext()"
                  @select="activateAction(groupAction)"
                />
              </ListboxGroup>
            </template>

            <CommandMenuLoadingSkeleton v-else-if="isLoadingActions" />

            <UIText
              v-else
              :text="`No results found for '${searchInput}'`"
              class="flex p-lg text-xs text-tertiary"
            />
          </ListboxContent>

          <div
            v-if="preview !== null"
            class="h-full border-l border-secondary p-xl"
          >
            <Component :is="preview" />
          </div>
        </div>
      </ListboxRoot>
    </DialogContent>

    <DialogOverlay
      class="
        absolute inset-0 z-39 bg-black/5
        dark:bg-black/20
      "
      data-overlay
    />
  </DialogRoot>
</template>

<style scoped>
@keyframes cmd-menu-enter {
  from {
    opacity: 0;
    transform: scale(1.02);
  }
}

@keyframes cmd-menu-bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.995);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes cmd-menu-exit {
  to {
    opacity: 0;
    transform: scale(1.02);
  }
}

@keyframes overlay-enter {
  from {
    opacity: 0;
  }
}

@keyframes overlay-exit {
  to {
    opacity: 0;
  }
}

[data-command-menu][data-state='open']:not(.navigated) {
  animation: cmd-menu-enter 0.2s cubic-bezier(0.68, 0, 0, 1.5);
}

[data-command-menu].bouncing {
  animation: cmd-menu-bounce 0.2s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

[data-command-menu][data-state='closed'] {
  animation: cmd-menu-exit 0.1s;
}

[data-overlay][data-state='open'] {
  animation: overlay-enter 0.1s;
}

[data-overlay][data-state='closed'] {
  animation: overlay-exit 0.1s;
}
</style>
