<script setup lang="ts">
import { toValue } from 'vue'

import PreferencesHighlightWord from '#components/PreferencesHighlightWord.vue'
import { useInjectPreferencesSectionContext } from '#context/preferencesSection.context'

const props = withDefaults(defineProps<{
  isSingleColumnLayout?: boolean
}>(), {
  isSingleColumnLayout: false,
})

const {
  section,
} = useInjectPreferencesSectionContext()
</script>

<template>
  <section
    :class="{
      '@6xl/preferences:grid-cols-[1fr_1.5fr]': props.isSingleColumnLayout,
      '@2xl/preferences:grid-cols-[1fr_1.5fr]': !props.isSingleColumnLayout,
    }"
    class="grid gap-x-4xl gap-y-2xl p-3xl"
  >
    <header>
      <!-- eslint-disable-next-line vuejs-accessibility/heading-has-content -->
      <h2 class="text-sm font-semibold text-secondary">
        <PreferencesHighlightWord :text="toValue(section.title)" />
      </h2>

      <p class="mt-xs text-sm text-tertiary">
        <PreferencesHighlightWord :text="toValue(section.description)" />
      </p>
    </header>

    <div
      class="
        ml-auto flex w-full
        @2xl/preferences:justify-end
      "
    >
      <slot />
    </div>
  </section>
</template>
