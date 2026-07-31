<script setup lang="ts">
import {
  Inbox02Icon,
  Settings01Icon,
  User01Icon,
} from '@wisemen/vue-core-icons'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

import type { TabsVariant } from '@/ui/tabs/tabs.props'
import TabsRouterLink from '@/ui/tabs/TabsRouterLink.vue'
import TabsRouterLinkContent from '@/ui/tabs/TabsRouterLinkContent.vue'
import TabsRouterLinkItem from '@/ui/tabs/TabsRouterLinkItem.vue'

const props = withDefaults(defineProps<{
  isFullWidth?: boolean
  orientation?: 'horizontal' | 'vertical'
  variant?: TabsVariant
}>(), {
  isFullWidth: false,
  orientation: 'horizontal',
  variant: 'underline',
})

const router = useRouter()

onBeforeMount(() => {
  const routes = [
    {
      name: 'general',
      path: '/tabs-story/general',
      component: {
        template: '<div class="p-4 text-sm text-secondary">General content goes here.</div>',
      },
    },
    {
      name: 'members',
      path: '/tabs-story/members',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Members content goes here.</div>',
      },
    },
    {
      name: 'settings',
      path: '/tabs-story/settings',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Settings content goes here.</div>',
      },
    },
  ]

  for (const route of routes) {
    if (!router.hasRoute(route.name)) {
      router.addRoute(route)
    }
  }

  router.replace({
    name: 'general',
  })
})
</script>

<template>
  <div class="flex w-3xl flex-col gap-4">
    <TabsRouterLink
      :is-full-width="props.isFullWidth"
      :variant="props.variant"
      :orientation="props.orientation"
    >
      <TabsRouterLinkItem
        :config="{
          left: {
            icon: User01Icon,
            type: 'icon',
          },
        }"
        :to="{ name: 'general' }"
        label="General"
      />
      <TabsRouterLinkItem
        :config="{
          left: {
            icon: Inbox02Icon,
            type: 'icon',
          },
          indicator: {
            value: 12,
            type: 'count',
          },
        }"
        :to="{ name: 'members' }"
        label="Members"
      />
      <TabsRouterLinkItem
        :config="{
          left: {
            icon: Settings01Icon,
            type: 'icon',
          },
          indicator: {
            type: 'dot',
          },
        }"
        :to="{ name: 'settings' }"
        label="Settings"
      />
    </TabsRouterLink>

    <TabsRouterLinkContent />
  </div>
</template>
