<script setup lang="ts">
import BreadcrumbItem from '@/ui/breadcrumbs/BreadcrumbItem.vue'
import BreadcrumbItems from '@/ui/breadcrumbs/BreadcrumbItems.vue'
import BreadcrumbRoot from '@/ui/breadcrumbs/BreadcrumbRoot.vue'
import BreadcrumbSeparator from '@/ui/breadcrumbs/BreadcrumbSeparator.vue'
import type { PageBreadcrumb } from '@/ui/page/dashboardPage.type'

const props = defineProps<{
  breadcrumbs: PageBreadcrumb[]
}>()
</script>

<template>
  <BreadcrumbRoot v-if="props.breadcrumbs.length > 0">
    <BreadcrumbItems>
      <template
        v-for="(breadcrumb, breadcrumbIndex) of props.breadcrumbs"
        :key="`${breadcrumb.label}-${breadcrumbIndex}`"
      >
        <BreadcrumbItem
          :icon="breadcrumb.icon"
          :to="breadcrumb.to"
          :label="breadcrumb.label"
        />
        <BreadcrumbSeparator
          v-if="breadcrumbIndex < props.breadcrumbs.length - 1"
        />
      </template>
    </BreadcrumbItems>
  </BreadcrumbRoot>
</template>
