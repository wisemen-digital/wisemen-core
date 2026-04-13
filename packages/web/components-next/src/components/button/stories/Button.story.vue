<script setup lang="ts">
import { ref } from 'vue'

import Button from '@/components/button/default-button/Button.vue'

const isLoading = ref<boolean>(true)
</script>

<template>
  <Story title="Button/Button">
    <Variant title="Primary">
      <Button
        variant="primary"
        icon-left="plus"
      >
        Button
      </Button>

      <Button
        :is-disabled="true"
        variant="primary"
        icon-left="plus"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Secondary">
      <Button
        icon-left="plus"
        variant="secondary"
      >
        Button
      </Button>

      <Button
        :is-disabled="true"
        icon-left="plus"
        variant="secondary"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Tertiary">
      <Button
        icon-left="plus"
        variant="tertiary"
      >
        Button
      </Button>

      <Button
        :is-disabled="true"
        variant="tertiary"
        icon-left="plus"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Destructive Primary">
      <Button
        icon-left="plus"
        variant="destructive-primary"
      >
        Button
      </Button>

      <Button
        :is-disabled="true"
        variant="destructive-primary"
        icon-left="plus"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Destructive Secondary">
      <Button
        icon-left="plus"
        variant="destructive-secondary"
      >
        Button
      </Button>

      <Button
        :is-disabled="true"
        variant="destructive-secondary"
        icon-left="plus"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Destructive Tertiary">
      <Button
        icon-left="plus"
        variant="destructive-tertiary"
      >
        Button
      </Button>

      <Button
        :is-disabled="true"
        variant="destructive-tertiary"
        icon-left="plus"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Sm">
      <Button
        icon-left="plus"
        size="sm"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Md">
      <Button
        icon-left="plus"
        size="md"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Lg">
      <Button
        icon-left="plus"
        size="lg"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Xl">
      <Button
        icon-left="plus"
        size="xl"
      >
        Button
      </Button>
    </Variant>

    <Variant title="2xl">
      <Button
        icon-left="plus"
        size="2xl"
      >
        Button
      </Button>
    </Variant>

    <Variant title="Loading">
      <input
        v-model="isLoading"
        type="checkbox"
      >

      <Button
        :is-loading="isLoading"
        icon-left="plus"
      >
        Button
      </Button>
    </Variant>
  </Story>
</template>
