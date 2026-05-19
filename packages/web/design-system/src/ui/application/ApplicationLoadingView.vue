<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import {
  computed,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { UIColumnLayout } from '@/ui/column-layout'
import { useMainSidebar } from '@/ui/sidebar'
import { UITextShimmer } from '@/ui/text-shimmer'

const props = defineProps<{
  isFetchingAuthUser: boolean
}>()

const i18n = useI18n()
const router = useRouter()

const {
  isFloatingSidebar,
  isSidebarOpen,
  sidebarWidth,
} = useMainSidebar()

const isRouterLoading = ref<boolean>(true)
const isLoadingTextVisible = ref<boolean>(false)

router.isReady().then(() => {
  isRouterLoading.value = false
})

const isLoadingVisible = computed<boolean>(() => (
  props.isFetchingAuthUser || isRouterLoading.value
))

setTimeout(() => {
  isLoadingTextVisible.value = true
}, 500)
</script>

<template>
  <AnimatePresence>
    <Motion
      v-if="isLoadingVisible"
      :exit="{ opacity: 0 }"
      :transition="{ duration: 0.2 }"
      :style="{
        paddingLeft: isSidebarOpen && !isFloatingSidebar ? sidebarWidth : '0.5rem',
      }"
      class="absolute inset-0 z-99 size-full bg-secondary"
    >
      <div class="size-full p-md pl-none">
        <div
          class="
            size-full rounded-2xl border border-secondary bg-primary shadow-sm/5
          "
        >
          <UIColumnLayout
            v-if="isLoadingTextVisible"
            class="size-full"
            align="center"
            justify="center"
          >
            <UITextShimmer>
              <h1 class="text-sm font-medium">
                {{ i18n.t('component.dashboard_page_loading_state.loading') }}
              </h1>
            </UITextShimmer>
          </UIColumnLayout>
        </div>
      </div>
    </Motion>
  </AnimatePresence>
</template>
