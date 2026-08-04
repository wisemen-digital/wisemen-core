<script setup lang="ts">
import {
  CalendarIcon,
  File05Icon,
  Inbox02Icon,
  LifeBuoy01Icon,
  Settings01Icon,
  User01Icon,
  Users01Icon,
} from '@wisemen/vue-core-icons'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

import type { TabsVariant } from '@/ui/tabs/tabs.props'
import TabsRouterLink from '@/ui/tabs/TabsRouterLink.vue'
import TabsRouterLinkContent from '@/ui/tabs/TabsRouterLinkContent.vue'
import TabsRouterLinkItem from '@/ui/tabs/TabsRouterLinkItem.vue'

const props = withDefaults(defineProps<{
  variant?: TabsVariant
}>(), {
  variant: 'underline',
})

const router = useRouter()

onBeforeMount(() => {
  const routes = [
    {
      name: 'overflow-general',
      path: '/tabs-overflow-story/general',
      component: {
        template: '<div class="p-4 text-sm text-secondary">General content goes here.</div>',
      },
    },
    {
      name: 'overflow-members',
      path: '/tabs-overflow-story/members',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Members content goes here.</div>',
      },
    },
    {
      name: 'overflow-teams',
      path: '/tabs-overflow-story/teams',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Teams content goes here.</div>',
      },
    },
    {
      name: 'overflow-documents',
      path: '/tabs-overflow-story/documents',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Documents content goes here.</div>',
      },
    },
    {
      name: 'overflow-calendar',
      path: '/tabs-overflow-story/calendar',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Calendar content goes here.</div>',
      },
    },
    {
      name: 'overflow-support',
      path: '/tabs-overflow-story/support',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Support content goes here.</div>',
      },
    },
    {
      name: 'overflow-settings',
      path: '/tabs-overflow-story/settings',
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
    name: 'overflow-general',
  })
})
</script>

<template>
  <div
    data-testid="tabs-router-overflow-container"
    class="
      flex w-80 resize-x flex-col gap-4 overflow-auto rounded-md border
      border-dashed border-tertiary p-2
    "
  >
    <TabsRouterLink
      :variant="props.variant"
    >
      <TabsRouterLinkItem
        :config="{
          left: {
            icon: User01Icon,
            type: 'icon',
          },
        }"
        :to="{ name: 'overflow-general' }"
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
        :to="{ name: 'overflow-members' }"
        label="Members"
      />
      <TabsRouterLinkItem
        :config="{
          left: {
            icon: Users01Icon,
            type: 'icon',
          },
        }"
        :to="{ name: 'overflow-teams' }"
        label="Teams"
      />
      <TabsRouterLinkItem
        :config="{
          left: {
            icon: File05Icon,
            type: 'icon',
          },
          indicator: {
            value: 5,
            type: 'count',
          },
        }"
        :to="{ name: 'overflow-documents' }"
        label="Documents"
      />
      <TabsRouterLinkItem
        :config="{
          left: {
            icon: CalendarIcon,
            type: 'icon',
          },
        }"
        :to="{ name: 'overflow-calendar' }"
        label="Calendar"
      />
      <TabsRouterLinkItem
        :config="{
          left: {
            icon: LifeBuoy01Icon,
            type: 'icon',
          },
        }"
        :to="{ name: 'overflow-support' }"
        label="Support"
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
        :to="{ name: 'overflow-settings' }"
        label="Settings"
      />
    </TabsRouterLink>

    <TabsRouterLinkContent />
  </div>
</template>
