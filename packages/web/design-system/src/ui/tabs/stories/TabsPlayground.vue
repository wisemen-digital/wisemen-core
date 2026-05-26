<script setup lang="ts">
import {
  Inbox02Icon,
  Settings01Icon,
  User01Icon,
} from '@wisemen/vue-core-icons'
import { ref } from 'vue'

import type {
  TabsHorizontalListPadding,
  TabsVariant,
} from '@/ui/tabs/tabs.props'
import Tabs from '@/ui/tabs/Tabs.vue'
import TabsContent from '@/ui/tabs/TabsContent.vue'
import TabsItem from '@/ui/tabs/TabsItem.vue'
import TabsList from '@/ui/tabs/TabsList.vue'

const props = withDefaults(defineProps<{
  isFullWidth?: boolean
  orientation?: 'horizontal' | 'vertical'
  underlineTabsHorizontalListPadding?: TabsHorizontalListPadding
  variant?: TabsVariant
}>(), {
  isFullWidth: false,
  orientation: 'horizontal',
  underlineTabsHorizontalListPadding: 'none',
  variant: 'underline',
})

const selectedTab = ref<string>('tab1')
</script>

<template>
  <div class="flex w-3xl flex-col gap-4">
    <Tabs
      v-model="selectedTab"
      :is-full-width="props.isFullWidth"
      :orientation="props.orientation"
      :underline-tabs-horizontal-list-padding="props.underlineTabsHorizontalListPadding"
      :variant="props.variant"
    >
      <TabsList>
        <TabsItem
          :icon="User01Icon"
          label="General"
          value="tab1"
        />
        <TabsItem
          :icon="Inbox02Icon"
          :count="12"
          label="Members"
          value="tab2"
        />
        <TabsItem
          :is-disabled="true"
          disabled-reason="This tab is disabled for demonstration purposes."
          label="Disabled"
          value="tab3"
        />
        <TabsItem
          :icon="Settings01Icon"
          :count="3"
          label="Settings"
          value="tab4"
        />
      </TabsList>

      <TabsContent value="tab1">
        <div class="p-4 text-sm text-secondary">
          General content goes here.
        </div>
      </TabsContent>

      <TabsContent value="tab2">
        <div class="p-4 text-sm text-secondary">
          Members content goes here.
        </div>
      </TabsContent>

      <TabsContent value="tab3">
        <div class="p-4 text-sm text-secondary">
          This tab is disabled.
        </div>
      </TabsContent>

      <TabsContent value="tab4">
        <div class="p-4 text-sm text-secondary">
          Settings content goes here.
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
