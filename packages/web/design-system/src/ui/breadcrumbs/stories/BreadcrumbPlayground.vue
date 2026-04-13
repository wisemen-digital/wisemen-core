<script setup lang="ts">
import {
  NotificationMessageIcon,
  User01Icon,
  Users01Icon,
} from '@wisemen/vue-core-icons'

import BreadcrumbItem from '@/ui/breadcrumbs/BreadcrumbItem.vue'
import BreadcrumbItems from '@/ui/breadcrumbs/BreadcrumbItems.vue'
import BreadcrumbRoot from '@/ui/breadcrumbs/BreadcrumbRoot.vue'
import BreadcrumbSeparator from '@/ui/breadcrumbs/BreadcrumbSeparator.vue'
</script>

<template>
  <BreadcrumbRoot>
    <BreadcrumbItems>
      <BreadcrumbItem
        :icon="Users01Icon"
        label="Users"
        to="/"
      />

      <BreadcrumbSeparator />

      <BreadcrumbItem
        :icon="NotificationMessageIcon"
        :is-label-hidden="true"
        label="Messages"
        to="/"
      />

      <BreadcrumbSeparator />

      <BreadcrumbItem
        :icon="User01Icon"
        label="Jeroen"
        to="/"
      />

      <BreadcrumbSeparator />

      <BreadcrumbItem label="Projects" />
    </BreadcrumbItems>
  </BreadcrumbRoot>
</template>
