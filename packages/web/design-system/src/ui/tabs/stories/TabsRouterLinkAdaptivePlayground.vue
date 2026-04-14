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
      name: 'adaptive-general',
      path: '/adaptive-tabs-story/general',
      component: {
        template: '<div class="p-4 text-sm text-secondary">General content goes here.</div>',
      },
    },
    {
      name: 'adaptive-members',
      path: '/adaptive-tabs-story/members',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Members content goes here.</div>',
      },
    },
    {
      name: 'adaptive-teams',
      path: '/adaptive-tabs-story/teams',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Teams content goes here.</div>',
      },
    },
    {
      name: 'adaptive-documents',
      path: '/adaptive-tabs-story/documents',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Documents content goes here.</div>',
      },
    },
    {
      name: 'adaptive-calendar',
      path: '/adaptive-tabs-story/calendar',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Calendar content goes here.</div>',
      },
    },
    {
      name: 'adaptive-support',
      path: '/adaptive-tabs-story/support',
      component: {
        template: '<div class="p-4 text-sm text-secondary">Support content goes here.</div>',
      },
    },
    {
      name: 'adaptive-settings',
      path: '/adaptive-tabs-story/settings',
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
    name: 'adaptive-general',
  })
})
</script>

<template>
  <div
    class="
      flex w-80 resize-x flex-col gap-4 overflow-auto rounded-md border
      border-dashed border-tertiary p-2
    "
  >
    <TabsRouterLink
      :is-adaptive="true"
      :variant="props.variant"
    >
      <TabsRouterLinkItem
        :icon="User01Icon"
        :to="{ name: 'adaptive-general' }"
        label="General"
      />
      <TabsRouterLinkItem
        :icon="Inbox02Icon"
        :to="{ name: 'adaptive-members' }"
        :count="12"
        label="Members"
      />
      <TabsRouterLinkItem
        :icon="Users01Icon"
        :to="{ name: 'adaptive-teams' }"
        label="Teams"
      />
      <TabsRouterLinkItem
        :icon="File05Icon"
        :to="{ name: 'adaptive-documents' }"
        :count="5"
        label="Documents"
      />
      <TabsRouterLinkItem
        :icon="CalendarIcon"
        :to="{ name: 'adaptive-calendar' }"
        label="Calendar"
      />
      <TabsRouterLinkItem
        :icon="LifeBuoy01Icon"
        :to="{ name: 'adaptive-support' }"
        label="Support"
      />
      <TabsRouterLinkItem
        :icon="Settings01Icon"
        :to="{ name: 'adaptive-settings' }"
        :count="3"
        label="Settings"
      />
    </TabsRouterLink>

    <TabsRouterLinkContent />
  </div>
</template>
