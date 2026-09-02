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
import { ref } from 'vue'

import type { TabsVariant } from '@/ui/tabs/tabs.props'
import Tabs from '@/ui/tabs/Tabs.vue'
import TabsContent from '@/ui/tabs/TabsContent.vue'
import TabsItem from '@/ui/tabs/TabsItem.vue'
import TabsList from '@/ui/tabs/TabsList.vue'

const props = withDefaults(defineProps<{
  variant?: TabsVariant
}>(), {
  variant: 'underline',
})

const selectedTab = ref<string>('tab1')
</script>

<template>
  <div
    data-testid="tabs-overflow-container"
    class="
      flex w-80 resize-x flex-col gap-4 overflow-auto rounded-md border
      border-dashed border-tertiary p-2
    "
  >
    <Tabs
      v-model="selectedTab"
      :variant="props.variant"
    >
      <TabsList>
        <TabsItem
          :config="{
            left: {
              icon: User01Icon,
              type: 'icon',
            },
          }"
          label="General"
          value="tab1"
        />
        <TabsItem
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
          label="Members"
          value="tab2"
        />
        <TabsItem
          :config="{
            left: {
              icon: Users01Icon,
              type: 'icon',
            },
          }"
          label="Teams"
          value="tab3"
        />
        <TabsItem
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
          label="Documents"
          value="tab4"
        />
        <TabsItem
          :config="{
            left: {
              icon: CalendarIcon,
              type: 'icon',
            },
          }"
          label="Calendar"
          value="tab5"
        />
        <TabsItem
          :config="{
            left: {
              icon: LifeBuoy01Icon,
              type: 'icon',
            },
          }"
          label="Support"
          value="tab6"
        />
        <TabsItem
          :config="{
            left: {
              icon: Settings01Icon,
              type: 'icon',
            },
            indicator: {
              type: 'dot',
            },
          }"
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
