<script setup lang="ts">
import {
  User01Icon,
  Users01Icon,
} from '@wisemen/vue-core-icons'

import BreadcrumbItem from '@/ui/breadcrumbs/BreadcrumbItem.vue'
import BreadcrumbItems from '@/ui/breadcrumbs/BreadcrumbItems.vue'
import BreadcrumbRoot from '@/ui/breadcrumbs/BreadcrumbRoot.vue'
import BreadcrumbSeparator from '@/ui/breadcrumbs/BreadcrumbSeparator.vue'
</script>

<template>
  <div
    class="
      w-full max-w-lg resize-x overflow-auto border border-dashed
      border-secondary p-4
    "
  >
    <BreadcrumbRoot>
      <BreadcrumbItems>
        <BreadcrumbItem
          :icon="Users01Icon"
          label="Organization Management"
          to="/"
        />

        <BreadcrumbSeparator />

        <BreadcrumbItem
          :icon="User01Icon"
          label="Jeroen Van Colen"
          to="/"
        />

        <BreadcrumbSeparator />

        <BreadcrumbItem label="Project Configuration Settings" />
      </BreadcrumbItems>
    </BreadcrumbRoot>
  </div>
</template>
