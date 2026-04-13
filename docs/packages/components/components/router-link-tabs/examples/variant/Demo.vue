<script setup lang="ts">
import {
  VcRouterLinkTabs,
  VcRouterLinkTabsItem,
} from '@wisemen/vue-core-components'
</script>

<template>
  <div class="flex flex-col items-center gap-10">
    <VcRouterLinkTabs>
      <template #items>
        <VcRouterLinkTabsItem
          to="/wisemen-core/packages/components/components/router-link-tabs/router-link-tabs.html"
        >
          Router Link tabs docs
        </VcRouterLinkTabsItem>
        <VcRouterLinkTabsItem
          to="/wisemen-core/packages/components/components/tabs/tabs.html"
        >
          Tabs docs
        </VcRouterLinkTabsItem>
      </template>
    </VcRouterLinkTabs>
    <VcRouterLinkTabs variant="button-border">
      <template #items>
        <VcRouterLinkTabsItem
          to="/wisemen-core/packages/components/components/router-link-tabs/router-link-tabs.html"
        >
          Router Link tabs docs
        </VcRouterLinkTabsItem>
        <VcRouterLinkTabsItem
          to="/wisemen-core/packages/components/components/tabs/tabs.html"
        >
          Tabs docs
        </VcRouterLinkTabsItem>
      </template>
    </VcRouterLinkTabs>
    <VcRouterLinkTabs variant="button-brand">
      <template #items>
        <VcRouterLinkTabsItem
          to="/wisemen-core/packages/components/components/router-link-tabs/router-link-tabs.html"
        >
          Router Link tabs docs
        </VcRouterLinkTabsItem>
        <VcRouterLinkTabsItem
          to="/wisemen-core/packages/components/components/tabs/tabs.html"
        >
          Tabs docs
        </VcRouterLinkTabsItem>
      </template>
    </VcRouterLinkTabs>
  </div>
</template>
