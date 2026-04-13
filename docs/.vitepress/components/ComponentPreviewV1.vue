<script setup lang="ts">
import type { TabItem } from '@wisemen/vue-core'
import {
  VcCollapsable2,
  VcConfigProvider,
  VcDialogContainer,
  VcSwitch,
  VcTabs,
  VcThemeProvider,
} from '@wisemen/vue-core'
import {
  computed,
  ref,
} from 'vue'

const props = defineProps<{
  name: string
  files?: string
}>()

const showCode = ref<boolean>(false)

const parsedFiles = computed<string[]>(() => JSON.parse(decodeURIComponent(props.files ?? '')))

const tabItems = computed<TabItem[]>(() => {
  // Sort parsedFiles by first 'Demo.vue' and then by the file name
  const parsedFilesSorted = parsedFiles.value.toSorted((a, b) => {
    if (a === 'Demo.vue') {
      return -1
    }

    if (b === 'Demo.vue') {
      return 1
    }

    return a.localeCompare(b)
  })

  return parsedFilesSorted.map((fileName) => ({
    label: fileName,
    value: fileName,
  }))
})

const selectedTab = ref<TabItem | null>(tabItems.value?.[0] ?? null)
</script>

<template>
  <VcConfigProvider locale="en-NL">
    <VcThemeProvider theme="default">
      <VcDialogContainer />
      <div class="flex flex-col gap-2">
        <div class="vp-raw">
          <div class="flex justify-end gap-x-4">
            <VcSwitch
              v-model="showCode"
              :style-config="{
              // '--switch-label-font-size-default': '12px',
              }"
              label="Show code"
            />
          </div>
        </div>

        <div>
          <VcCollapsable2>
            <div v-if="!showCode">
              <div
                class="
                  vp-raw flex items-center justify-center rounded-lg border
                  border-solid border-gray-100 p-16
                  dark:border-black dark:bg-gray-950
                "
              >
                <VcConfigProvider
                  locale="nl-US"
                  teleport-target-selector="#teleport-target"
                  google-maps-api-key="AIzaSyATX2fY3BZwaKeURsQhwpEVLmLRr27s4vw"
                >
                  <slot />
                </VcConfigProvider>
              </div>
            </div>

            <div v-else>
              <VcTabs
                v-if="selectedTab"
                v-model="selectedTab"
                :items="tabItems"
              >
                <template
                  v-for="(fileName, index) in parsedFiles"
                  :key="index"
                >
                  <div v-if="selectedTab.value === fileName">
                    <slot :name="index" />
                  </div>
                </template>
              </VcTabs>
            </div>
          </VcCollapsable2>
        </div>
      </div>

      <div
        id="teleport-target"
        class="vp-raw"
      />
    </VcThemeProvider>
  </VcConfigProvider>
</template>
