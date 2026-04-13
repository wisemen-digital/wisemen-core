<script setup lang="ts">
import { ref } from 'vue'

import ButtonTabs from '@/components/tabs/button/ButtonTabs.vue'
import ButtonTabsContent from '@/components/tabs/button/parts/ButtonTabsContent.vue'
import ButtonTabsItem from '@/components/tabs/button/parts/ButtonTabsItem.vue'

const selectedTab = ref<string>('tab5')
</script>

<template>
  <Story title="Tabs">
    <Variant title="Underline">
      <div class="w-84">
        <ButtonTabs v-model="selectedTab">
          <template #items>
            <ButtonTabsItem value="tab1">
              First tab
            </ButtonTabsItem>
            <ButtonTabsItem value="tab2">
              Second tab
            </ButtonTabsItem>
            <ButtonTabsItem
              :is-disabled="true"
              value="tab3"
            >
              A third tab
            </ButtonTabsItem>
            <ButtonTabsItem
              value="tab4"
            >
              A third tab
            </ButtonTabsItem>
            <ButtonTabsItem
              value="tab5"
            >
              A third tab
            </ButtonTabsItem>
            <ButtonTabsItem
              value="tab6"
            >
              A third tab
            </ButtonTabsItem>
          </template>

          <template #content>
            <ButtonTabsContent value="tab1">
              Tab1 content
            </ButtonTabsContent>

            <ButtonTabsContent value="tab2">
              Tab2 content
            </ButtonTabsContent>

            <ButtonTabsContent value="tab3">
              Tab3 content
            </ButtonTabsContent>
            <ButtonTabsContent value="tab4">
              Tab4 content
            </ButtonTabsContent>
            <ButtonTabsContent value="tab5">
              Tab5 content
            </ButtonTabsContent>
            <ButtonTabsContent value="tab6">
              Tab6 content
            </ButtonTabsContent>
          </template>
        </ButtonTabs>
      </div>

      <ButtonTabs
        v-model="selectedTab"
        orientation="vertical"
      >
        <template #items>
          <ButtonTabsItem value="tab1">
            First tab
          </ButtonTabsItem>
          <ButtonTabsItem value="tab2">
            Second tab
          </ButtonTabsItem>
          <ButtonTabsItem
            :is-disabled="true"
            value="tab3"
          >
            A third tab
          </ButtonTabsItem>
        </template>

        <template #content>
          <ButtonTabsContent value="tab1">
            Tab1 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab2">
            Tab2 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab3">
            Tab3 content
          </ButtonTabsContent>
        </template>
      </ButtonTabs>
    </Variant>

    <Variant title="Button border">
      <ButtonTabs
        v-model="selectedTab"
        variant="button-border"
      >
        <template #items>
          <ButtonTabsItem value="tab1">
            First tab
          </ButtonTabsItem>
          <ButtonTabsItem value="tab2">
            Second tab
          </ButtonTabsItem>
          <ButtonTabsItem
            :is-disabled="true"
            value="tab3"
          >
            A third tab
          </ButtonTabsItem>
        </template>

        <template #content>
          <ButtonTabsContent value="tab1">
            Tab1 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab2">
            Tab2 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab3">
            Tab3 content
          </ButtonTabsContent>
        </template>
      </ButtonTabs>

      <ButtonTabs
        v-model="selectedTab"
        variant="button-border"
        orientation="vertical"
      >
        <template #items>
          <ButtonTabsItem value="tab1">
            First tab
          </ButtonTabsItem>
          <ButtonTabsItem value="tab2">
            Second tab
          </ButtonTabsItem>
          <ButtonTabsItem
            :is-disabled="true"
            value="tab3"
          >
            A third tab
          </ButtonTabsItem>
        </template>

        <template #content>
          <ButtonTabsContent value="tab1">
            Tab1 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab2">
            Tab2 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab3">
            Tab3 content
          </ButtonTabsContent>
        </template>
      </ButtonTabs>
    </Variant>

    <Variant title="Button brand">
      <ButtonTabs
        v-model="selectedTab"
        variant="button-brand"
      >
        <template #items>
          <ButtonTabsItem value="tab1">
            First tab
          </ButtonTabsItem>
          <ButtonTabsItem value="tab2">
            Second tab
          </ButtonTabsItem>
          <ButtonTabsItem
            :is-disabled="true"
            value="tab3"
          >
            A third tab
          </ButtonTabsItem>
        </template>

        <template #content>
          <ButtonTabsContent value="tab1">
            Tab1 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab2">
            Tab2 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab3">
            Tab3 content
          </ButtonTabsContent>
        </template>
      </ButtonTabs>

      <ButtonTabs
        v-model="selectedTab"
        variant="button-brand"
        orientation="vertical"
      >
        <template #items>
          <ButtonTabsItem value="tab1">
            First tab
          </ButtonTabsItem>
          <ButtonTabsItem value="tab2">
            Second tab
          </ButtonTabsItem>
          <ButtonTabsItem
            :is-disabled="true"
            value="tab3"
          >
            A third tab
          </ButtonTabsItem>
        </template>

        <template #content>
          <ButtonTabsContent value="tab1">
            Tab1 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab2">
            Tab2 content
          </ButtonTabsContent>

          <ButtonTabsContent value="tab3">
            Tab3 content
          </ButtonTabsContent>
        </template>
      </ButtonTabs>
    </Variant>
  </Story>
</template>
