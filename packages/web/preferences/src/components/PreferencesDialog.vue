<script setup lang="ts" generic="TConfig extends PreferencesConfig">
import { UIText } from '@wisemen/vue-core-design-system'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import {
  computed,
  ref,
  toValue,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesContent from '#components/content/PreferencesContent.vue'
import PreferencesHeader from '#components/header/PreferencesHeader.vue'
import PreferencesSidebar from '#components/sidebar/PreferencesSidebar.vue'
import PreferencesSidebarContent from '#components/sidebar/PreferencesSidebarContent.vue'
import PreferencesSidebarSearchInput from '#components/sidebar/PreferencesSidebarSearchInput.vue'
import { usePreferencesHistory } from '#composables/preferencesHistory.composable'
import { useProvidePreferencesContext } from '#context/preferences.context'
import type {
  PreferencesCategory,
  PreferencesConfig,
  PreferencesView,
  ViewIdFromConfig,
} from '#types/preferences.type'
import type { PreferencesProps } from '#types/preferencesDialog.props'

const props = defineProps<PreferencesProps<TConfig>>()

const emit = defineEmits<{
  'afterLeave': []
  'close': []
  'update:activeView': [viewId: ViewIdFromConfig<PreferencesConfig>]
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
})

const i18n = useI18n()

const searchTerm = ref<string>('')
const isSidebarVisible = ref<boolean>(false)

const {
  activeItem,
  canGoBack,
  canGoForward,
  goBack,
  goForward,
  onShowItem,
  onShowSection,
  onShowView,
} = usePreferencesHistory(props.activeSection !== undefined
  ? {
      id: props.activeSection,
      type: 'section',
    }
  : {
      id: props.activeView ?? props.config.categories[0]!.views[0]!.id,
      type: 'view',
    })

const activeView = computed<PreferencesView>(() => {
  const views = props.config.categories.flatMap((category) => category.views)

  if (activeItem.value.type === 'view') {
    return views.find((view) => view.id === activeItem.value.id)!
  }

  return views.find((view) => view.sections.some(
    (section) => section.id === activeItem.value.id,
  ))!
})

const activeViewId = computed<string>({
  get: () => activeView.value.id,
  set: (id: string) => {
    onShowView(id)
  },
})

const filteredCategories = computed<PreferencesCategory[]>(() => {
  const isSearchTermEmpty = searchTerm.value.trim() === ''

  if (isSearchTermEmpty) {
    return props.config.categories
  }

  const categoriesWithMatchingItems = props.config.categories
    .map((category) => {
      const filteredViews = category.views
        .map((view) => {
          const matchingSections = view.sections.filter((section) => {
            const titleMatch = toValue(section.title).toLowerCase().includes(searchTerm.value.toLowerCase())
            const descriptionMatch = toValue(section.description).toLowerCase().includes(searchTerm.value.toLowerCase())

            const tagsMatch = toValue(section.tags).some((tag) =>
              tag.toLowerCase().includes(searchTerm.value.toLowerCase()))

            return titleMatch || descriptionMatch || tagsMatch
          })

          const isViewTitleMatch = toValue(view.title).toLowerCase().includes(searchTerm.value.toLowerCase())
          const isViewDescriptionMatch = toValue(view.description)
            ?.toLowerCase()
            .includes(searchTerm.value.toLowerCase()) ?? false

          if (isViewTitleMatch || isViewDescriptionMatch || matchingSections.length > 0) {
            return {
              ...view,
              sections: matchingSections,
            }
          }

          return null
        })
        .filter(Boolean)

      return {
        ...category,
        views: filteredViews,
      }
    })
    .filter((category) => category.views.length > 0)

  return categoriesWithMatchingItems as PreferencesCategory[]
})

function onUpdateIsOpen(isOpen: boolean): void {
  if (!isOpen) {
    emit('close')
  }
}

watch(activeViewId, (viewId) => {
  emit('update:activeView', viewId)
})

useProvidePreferencesContext({
  isSidebarVisible,
  activeItem,
  activeView,
  canGoBack,
  canGoForward,
  config: computed<PreferencesConfig>(() => props.config),
  filteredCategories,
  goBack,
  goForward,
  searchTerm,
  onShowItem,
  onShowSection,
  onShowView,
})
</script>

<template>
  <DialogRoot
    v-model:open="isOpen"
    @update:open="onUpdateIsOpen"
  >
    <DialogContent
      class="
        @container/preferences absolute top-1/2 left-1/2 z-40 flex h-[95dvh]
        max-h-192 w-[95vw] max-w-5xl -translate-1/2 rounded-2xl border
        border-transparent bg-secondary p-sm shadow-lg
        dark:border-secondary
      "
      data-preferences-dialog
      @after-leave="emit('afterLeave')"
    >
      <DialogTitle class="sr-only">
        <h1>
          {{ i18n.t('module.preferences.title') }}
        </h1>
      </DialogTitle>

      <DialogDescription class="sr-only">
        <p>
          {{ i18n.t('module.preferences.description') }}
        </p>
      </DialogDescription>

      <PreferencesSidebar>
        <PreferencesSidebarSearchInput class="mt-md" />
        <PreferencesSidebarContent />
        <template
          v-if="props.config.appVersion"
          #footer
        >
          <UIText
            :text="props.config.appVersion"
            class="p-sm text-xs text-disabled"
          />
        </template>
      </PreferencesSidebar>

      <div
        class="
          flex w-full flex-col overflow-hidden rounded-xl border
          border-secondary bg-primary shadow-sm/5
          dark:shadow-none
        "
      >
        <PreferencesHeader />
        <PreferencesContent />
      </div>
    </DialogContent>

    <DialogOverlay
      class="
        absolute inset-0 z-39 bg-linear-to-t from-black/50 to-black/25
        dark:from-black/80 dark:to-black/50
      "
      data-overlay
    />
  </DialogRoot>
</template>

<style scoped>
@keyframes preferences-dialog-enter {
  from {
    opacity: 0;
    transform: scale(1.01);
  }
}

@keyframes preferences-exit {
  to {
    opacity: 0;
    transform: scale(1.01);
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

[data-preferences-dialog][data-state='open']:not(.navigated) {
  animation: preferences-dialog-enter 0.2s cubic-bezier(0.68, 0, 0, 1.5);
}

[data-preferences-dialog].bouncing {
  animation: preferences-bounce 0.2s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

[data-preferences-dialog][data-state='closed'] {
  animation: preferences-exit 0.1s;
}

[data-overlay][data-state='open'] {
  animation: overlay-enter 0.1s;
}

[data-overlay][data-state='closed'] {
  animation: overlay-exit 0.1s;
}
</style>
