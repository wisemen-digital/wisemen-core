<script setup lang="ts">
import { UIColumnLayout } from '@wisemen/vue-core-design-system'
import { ListboxContent } from 'reka-ui'
import { toValue } from 'vue'

import PreferencesSidebarCategory from '#components/sidebar/PreferencesSidebarCategory.vue'
import PreferencesSidebarNoResults from '#components/sidebar/PreferencesSidebarNoResults.vue'
import PreferencesSidebarSectionItem from '#components/sidebar/PreferencesSidebarSectionItem.vue'
import PreferencesSidebarViewItem from '#components/sidebar/PreferencesSidebarViewItem.vue'
import { useInjectPreferencesContext } from '#context/preferences.context'

const {
  config,
  filteredCategories,
  searchTerm,
} = useInjectPreferencesContext()

function viewHasMultipleSections(viewId: string): boolean {
  const views = config.value.categories
    .flatMap((category) => category.views)
    .find((view) => view.id === viewId)!

  return views.sections.length > 1
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
              && view.sections.length > 0"
            class="flex w-full flex-col gap-y-xxs pl-[2.3rem]"
          >
            <PreferencesSidebarSectionItem
              v-for="section of view.sections"
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
