<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import {
  CalendarIcon,
  File05Icon,
  Inbox02Icon,
  LifeBuoy01Icon,
  Settings01Icon,
  User01Icon,
  Users01Icon,
} from '@wisemen/vue-core-icons'
import { ref } from 'vue'

import type { TabsVariant } from '@/ui/tabs/tabs.props'
import Tabs from '@/ui/tabs/Tabs.vue'
import TabsContent from '@/ui/tabs/TabsContent.vue'
import TabsItem from '@/ui/tabs/TabsItem.vue'
import TabsList from '@/ui/tabs/TabsList.vue'

const props = withDefaults(defineProps<{
  isAdaptive?: boolean
  variant?: TabsVariant
}>(), {
  isAdaptive: false,
  variant: 'underline',
})

const selectedTab = ref<string>('tab1')
</script>

<template>
  <div
    :class="{ 'resize-x rounded-md border border-dashed border-tertiary p-2': props.isAdaptive }"
    class="flex w-80 flex-col gap-4 overflow-auto"
  >
    <Tabs
      v-model="selectedTab"
      :is-adaptive="props.isAdaptive"
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
          :icon="Users01Icon"
          label="Teams"
          value="tab3"
        />
        <TabsItem
          :icon="File05Icon"
          :count="5"
          label="Documents"
          value="tab4"
        />
        <TabsItem
          :icon="CalendarIcon"
          label="Calendar"
          value="tab5"
        />
        <TabsItem
          :icon="LifeBuoy01Icon"
          label="Support"
          value="tab6"
        />
        <TabsItem
          :icon="Settings01Icon"
          label="Settings"
          value="tab7"
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
          Teams content goes here.
        </div>
      </TabsContent>

      <TabsContent value="tab4">
        <div class="p-4 text-sm text-secondary">
          Documents content goes here.
        </div>
      </TabsContent>

      <TabsContent value="tab5">
        <div class="p-4 text-sm text-secondary">
          Calendar content goes here.
        </div>
      </TabsContent>

      <TabsContent value="tab6">
        <div class="p-4 text-sm text-secondary">
          Support content goes here.
        </div>
      </TabsContent>

      <TabsContent value="tab7">
        <div class="p-4 text-sm text-secondary">
          Settings content goes here.
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
