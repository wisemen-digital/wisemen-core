<!-- eslint-disable eslint-plugin-wisemen/vue-computed-ref-generics -->
<script setup lang="ts">
import { getPackagesNavigation } from '@docs/navigation/navigation.utils'
import { DOC_PATHS } from '@docs/navigation/paths'
import {
  UIButton,
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuHeader,
  UIDropdownMenuItem,
  UIDropdownMenuSeparator,
  UILink,
} from '@wisemen/vue-core-design-system'
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  useRoute,
  useRouter,
} from 'vitepress'
import { computed } from 'vue'

import {
  isApiRoute,
  isCmsRoute,
  isWebRoute,
} from './getStack.util'
import StackBadge from './StackBadge.vue'

const route = useRoute()
const router = useRouter()

const isApi = computed(() => isApiRoute(route.path))
const isWeb = computed(() => isWebRoute(route.path))
const isCms = computed(() => isCmsRoute(route.path))
const activeStack = computed<'api' | 'cms' | 'web' | null>(() => {
  if (isWeb.value) {
    return 'web'
  }

  if (isApi.value) {
    return 'api'
  }

  if (isCms.value) {
    return 'cms'
  }

  return null
})

const playbookLink = computed<string | null>(() => {
  if (activeStack.value === 'web') {
    return getFullPath(DOC_PATHS.webPlaybook)
  }

  if (activeStack.value === 'api') {
    return getFullPath(DOC_PATHS.apiPlaybook)
  }

  return null
})

const packageGroups = computed(() => {
  if (activeStack.value == null) {
    return []
  }

  return getPackagesNavigation(activeStack.value)
})

const isPackagesActive = computed(() => route.path.includes('/packages/'))

function navigateTo(path: string): void {
  const fullPath = getFullPath(path)

  if (fullPath === route.path) {
    return
  }

  void router.go(fullPath)
}

function getFullPath(path: string): string {
  return `/wisemen-core/docs${path}`
}
</script>

<template>
  <div
    v-if="activeStack != null"
    class=" justify-end items-center w-full gap-xl hidden lg:flex"
  >
    <StackBadge />
    <UILink
      v-if="playbookLink != null"
      :to="playbookLink"
      variant="tertiary"
      size="lg"
      label="Playbook"
    />

    <UIDropdownMenu v-if="packageGroups.length > 0">
      <template #trigger>
        <UIButton
          :variant="isPackagesActive ? 'tertiary' : 'secondary'"
          :icon-right="ChevronDownIcon"
          label="Packages"
          size="lg"
        />
      </template>

      <template #content>
        <template
          v-for="(group, groupIndex) in packageGroups"
          :key="group.text"
        >
          <UIDropdownMenuSeparator v-if="groupIndex > 0" />

          <UIDropdownMenuGroup>
            <UIDropdownMenuHeader
              v-if="group.text"
              :title="group.text"
            />

            <UIDropdownMenuItem
              v-for="item in group.items"
              :key="item.text"
              :label="item.text"
              @select="() => navigateTo(item.link as string)"
            />
          </UIDropdownMenuGroup>
        </template>
      </template>
    </UIDropdownMenu>
  </div>
</template>

<style scoped>
.stack-top-nav {
  display: none;
}

@media (min-width: 960px) {
  .stack-top-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 14px;
  }
}
</style>
