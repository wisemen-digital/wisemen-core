<script setup lang="ts">
import {
  VcRouterLinkTabs,
  VcRouterLinkTabsItem,
} from '@wisemen/vue-core-components'
</script>

<template>
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
</template>
