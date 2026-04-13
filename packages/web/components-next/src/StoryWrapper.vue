<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import ConfigProvider from '@/components/config-provider/ConfigProvider.vue'
import DialogContainer from '@/components/dialog/DialogContainer.vue'
import Switch from '@/components/switch/Switch.vue'
import ThemeProvider from '@/components/theme-provider/ThemeProvider.vue'
import { useAppearance } from '@/composables/appearance/appearance.composable'

const appearance = useAppearance()

const isDark = computed<boolean>({
  get: () => appearance.value === 'dark',
  set: (value) => appearance.value = value ? 'dark' : 'light',
})

const activeDialogCount = ref<number>(0)
</script>

<template>
  <div>
    <ConfigProvider
      locale="en-NL"
      teleport-target-selector="#teleport-target"
      google-maps-api-key="AIzaSyATX2fY3BZwaKeURsQhwpEVLmLRr27s4vw"
    >
      <ThemeProvider :appearance="appearance">
        <div
          :class="{
            // 'scale-98 overflow-hidden rounded-xl': activeDialogCount > 0,
          }"
          class="
            flex h-screen items-center justify-center gap-lg bg-primary
            duration-200
          "
        >
          <div class="absolute top-4 right-4">
            <Switch
              v-model="isDark"
              type="checkbox"
              label="Dark mode"
            />
          </div>

          <slot />
        </div>

        <div id="teleport-target" />

        <DialogContainer @update:active-dialog-count="activeDialogCount = $event" />
      </ThemeProvider>
    </ConfigProvider>
  </div>
</template>
