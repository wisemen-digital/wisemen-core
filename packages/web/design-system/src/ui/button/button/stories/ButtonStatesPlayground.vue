<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import Button from '@/ui/button/button/Button.vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Loading
      </p>
      <div class="flex items-center gap-2">
        <Button
          :is-loading="true"
          label="Loading"
          variant="primary"
        />
        <Button
          :is-loading="true"
          label="Loading"
          variant="secondary"
        />
        <Button
          :is-loading="true"
          label="Loading"
          variant="tertiary"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Disabled
      </p>
      <div class="flex items-center gap-2">
        <Button
          :is-disabled="true"
          label="Disabled"
          variant="primary"
        />
        <Button
          :is-disabled="true"
          label="Disabled"
          variant="secondary"
        />
        <Button
          :is-disabled="true"
          label="Disabled"
          variant="tertiary"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Disabled with reason
      </p>
      <div>
        <Button
          :is-disabled="true"
          disabled-reason="To showcase this feature"
          label="Disabled with reason"
          variant="primary"
        />
      </div>
    </div>
  </div>
</template>
