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

import type {
  TabsOverflowBehavior,
  TabsVariant,
} from '@/ui/tabs/tabs.props'
import TabsRouterLink from '@/ui/tabs/TabsRouterLink.vue'
import TabsRouterLinkContent from '@/ui/tabs/TabsRouterLinkContent.vue'
import TabsRouterLinkItem from '@/ui/tabs/TabsRouterLinkItem.vue'

const props = withDefaults(defineProps<{
  overflowBehavior?: TabsOverflowBehavior
  variant?: TabsVariant
}>(), {
  overflowBehavior: 'responsive-dropdown',
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
      :overflow-behavior="props.overflowBehavior"
      :variant="props.variant"
    >
      <TabsRouterLinkItem
        :icon="User01Icon"
        :to="{ name: 'overflow-general' }"
        label="General"
      />
      <TabsRouterLinkItem
        :icon="Inbox02Icon"
        :to="{ name: 'overflow-members' }"
        :count="12"
        label="Members"
      />
      <TabsRouterLinkItem
        :icon="Users01Icon"
        :to="{ name: 'overflow-teams' }"
        label="Teams"
      />
      <TabsRouterLinkItem
        :icon="File05Icon"
        :to="{ name: 'overflow-documents' }"
        :count="5"
        label="Documents"
      />
      <TabsRouterLinkItem
        :icon="CalendarIcon"
        :to="{ name: 'overflow-calendar' }"
        label="Calendar"
      />
      <TabsRouterLinkItem
        :icon="LifeBuoy01Icon"
        :to="{ name: 'overflow-support' }"
        label="Support"
      />
      <TabsRouterLinkItem
        :icon="Settings01Icon"
        :to="{ name: 'overflow-settings' }"
        :count="3"
        label="Settings"
      />
    </TabsRouterLink>

    <TabsRouterLinkContent />
  </div>
</template>
