<script setup lang="ts">
import { toValue } from 'vue'

import PreferencesHeaderCloseButton from '#components/header/PreferencesHeaderCloseButton.vue'
import PreferencesHeaderControls from '#components/header/PreferencesHeaderControls.vue'
import { useInjectPreferencesContext } from '#context/preferences.context'

const {
  activeView,
} = useInjectPreferencesContext()
</script>

<template>
  <header
    class="
      flex items-center justify-between border-b border-solid border-secondary
      py-md pr-lg pl-3xl
    "
  >
    <div class="flex items-center">
      <PreferencesHeaderControls />

      <h2 class="ml-lg text-sm font-semibold text-primary">
        {{ toValue(activeView.title) }}
      </h2>
    </div>

    <div>
      <PreferencesHeaderCloseButton />
    </div>
  </header>
</template>
