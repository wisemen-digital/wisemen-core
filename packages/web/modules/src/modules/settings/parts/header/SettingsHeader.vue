<script setup lang="ts">
import SettingsHeaderCloseButton from '@/modules/settings/parts/header/SettingsHeaderCloseButton.vue'
import SettingsHeaderControls from '@/modules/settings/parts/header/SettingsHeaderControls.vue'
import SettingsHeaderExpandButton from '@/modules/settings/parts/header/SettingsHeaderExpandButton.vue'
import { useInjectSettingsContext } from '@/modules/settings/settings.context'

const {
  activeView,
} = useInjectSettingsContext()
</script>

<template>
  <header
    class="
      flex items-center justify-between border-b border-solid border-secondary
      py-xl pr-2xl pl-4xl
    "
  >
    <div class="flex items-center">
      <SettingsHeaderControls />

      <h2 class="ml-md text-lg font-semibold text-primary">
        {{ activeView.title }}
      </h2>
    </div>

    <div class="flex items-center gap-x-xs">
      <slot name="header-right" />
      <SettingsHeaderExpandButton />
      <SettingsHeaderCloseButton />
    </div>
  </header>
</template>
