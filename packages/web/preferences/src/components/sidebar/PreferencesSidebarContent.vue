<script setup lang="ts">
import { UIColumnLayout } from '@wisemen/vue-core-design-system'
import { ListboxContent } from 'reka-ui'
import { toValue } from 'vue'

import PreferencesSidebarCategory from '#components/sidebar/PreferencesSidebarCategory.vue'
import PreferencesSidebarNoResults from '#components/sidebar/PreferencesSidebarNoResults.vue'
import PreferencesSidebarSectionItem from '#components/sidebar/PreferencesSidebarSectionItem.vue'
import PreferencesSidebarViewItem from '#components/sidebar/PreferencesSidebarViewItem.vue'
import { useInjectPreferencesContext } from '#context/preferences.context'
import { getViewSections } from '#utils/getViewSections.util'

const {
  config,
  filteredCategories,
  searchTerm,
} = useInjectPreferencesContext()

function viewHasMultipleSections(viewId: string): boolean {
  const view = config.value.categories
    .flatMap((category) => category.views)
    .find((view) => view.id === viewId)!

  return getViewSections(view).length > 1
}
</script>

<template>
  <ListboxContent class="mt-xl flex-1 overflow-auto">
    <UIColumnLayout>
      <PreferencesSidebarCategory
        v-for="(category, categoryIndex) of filteredCategories"
        :key="categoryIndex"
        :label="toValue(category.title) ?? null"
      >
        <template
          v-for="view of category.views"
          :key="view.id"
        >
          <PreferencesSidebarViewItem :view="view" />

          <ul
            v-if="searchTerm.trim().length > 0
              && viewHasMultipleSections(view.id)
              && getViewSections(view).length > 0"
            class="flex w-full flex-col gap-y-xxs pl-[2.3rem]"
          >
            <PreferencesSidebarSectionItem
              v-for="section of getViewSections(view)"
              :key="toValue(section.title)"
              :section="section"
            />
          </ul>
        </template>
      </PreferencesSidebarCategory>
    </UIColumnLayout>

    <PreferencesSidebarNoResults />
  </ListboxContent>
</template>
