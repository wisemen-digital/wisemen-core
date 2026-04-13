<script setup lang="ts">
import {
  extendIcons,
  useAppearance,
  VcConfigProvider,
  VcDialogContainer,
  VcSwitch,
  VcThemeProvider,
} from '@wisemen/vue-core-components'
import {
  computed,
  ref,
} from 'vue'

import { icons } from '@/icons/icons'
import LayoutStackRoot from '@/modules/stacked-layout/parts/LayoutStackRoot.vue'

extendIcons(icons)

const appearance = useAppearance()

const isDark = computed<boolean>({
  get: () => appearance.value === 'dark',
  set: (value) => appearance.value = value ? 'dark' : 'light',
})

const activeDialogCount = ref<number>(0)
</script>

<template>
  <div>
    <LayoutStackRoot>
      <VcConfigProvider
        locale="en-NL"
        teleport-target-selector="#teleport-target"
        google-maps-api-key="AIzaSyATX2fY3BZwaKeURsQhwpEVLmLRr27s4vw"
      >
        <VcThemeProvider :appearance="appearance">
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
              <VcSwitch
                v-model="isDark"
                type="checkbox"
                label="Dark mode"
              />
            </div>

            <slot />
          </div>

          <div id="teleport-target" />

          <VcDialogContainer @update:active-dialog-count="activeDialogCount = $event" />
        </VcThemeProvider>
      </VcConfigProvider>
    </LayoutStackRoot>
  </div>
</template>
