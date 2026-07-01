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
  isWebRoute,
} from './getStack.util.ts'
import StackBadge from './StackBadge.vue'

const route = useRoute()
const router = useRouter()

const isApi = computed(() => isApiRoute(route.path))
const isWeb = computed(() => isWebRoute(route.path))

const activeStack = computed<'api' | 'web' | null>(() => {
  if (isWeb.value) {
    return 'web'
  }

  if (isApi.value) {
    return 'api'
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
    class="flex w-full gap-md flex-col"
  >
    <div>
      <StackBadge />
    </div>

    <UILink
      v-if="playbookLink != null"
      id="playbook-link"
      :to="playbookLink"
      variant="tertiary"
      class="w-full justify-start! items-start! px-0!"
      size="lg"
      label="Playbook"
    />

    <UIDropdownMenu
      v-if="packageGroups.length > 0"
      class="w-full"
      popover-width="anchor-width"
    >
      <template #trigger>
        <UIButton
          id="dropdown-button"
          :variant="isPackagesActive ? 'tertiary' : 'secondary'"
          :icon-right="ChevronDownIcon"
          label="Packages"
          size="lg"
          class="w-full"
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

<style>
#dropdown-button > .grid > div:last-child {
  justify-content: space-between !important;
}

#playbook-link > .grid > div:last-child {
  justify-content: start !important;
}
</style>
