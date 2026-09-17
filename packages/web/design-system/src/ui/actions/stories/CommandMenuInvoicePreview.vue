<script setup lang="ts">
import { FileCheck02Icon } from '@wisemen/vue-core-icons'

import { UIBadge } from '@/ui/badge'
import { UIColumnLayout } from '@/ui/column-layout'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'
</script>

<template>
  <UIColumnLayout gap="lg">
    <UIRowLayout gap="sm">
      <FileCheck02Icon class="size-5 text-tertiary" />
      <UIText
        text="Invoice INV-1042"
        class="text-sm font-medium text-primary"
      />
    </UIRowLayout>

    <UIColumnLayout gap="sm">
      <UIRowLayout justify="between">
        <UIText
          text="Amount"
          class="text-xs text-tertiary"
        />
        <UIText
          text="€1,240.00"
          class="text-xs text-primary"
        />
      </UIRowLayout>

      <UIRowLayout justify="between">
        <UIText
          text="Due date"
          class="text-xs text-tertiary"
        />
        <UIText
          text="Aug 3, 2026"
          class="text-xs text-primary"
        />
      </UIRowLayout>

      <UIRowLayout justify="between">
        <UIText
          text="Status"
          class="text-xs text-tertiary"
        />
        <UIBadge
          label="Unpaid"
          color="warning"
          size="sm"
        />
      </UIRowLayout>
    </UIColumnLayout>
  </UIColumnLayout>
</template>
