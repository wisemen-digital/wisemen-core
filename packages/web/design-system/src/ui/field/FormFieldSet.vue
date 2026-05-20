<script setup lang="ts">
import type { FormFieldSetProps } from '@/ui/field/formFieldSet.props'
import { UIRowLayout } from '@/ui/row-layout'
import { UISeparator } from '@/ui/separator'

const props = withDefaults(defineProps<FormFieldSetProps>(), {
  isStacked: false,
  description: null,
  horizontalAlignment: 'start',
  variant: 'ghost',
})
</script>

<template>
  <div
    :class="{
      'rounded-2xl bg-secondary p-2xl': props.variant === 'card',
    }"
    class="@container/fieldset mx-auto w-full max-w-3xl"
  >
    <section
      :class="{
        '@xl/fieldset:grid-cols-[20rem_auto]': !props.isStacked,
      }"
      class="grid gap-x-8xl gap-y-2xl"
    >
      <header>
        <UIRowLayout>
          <h2 class="text-sm font-medium text-primary">
            {{ props.title }}
          </h2>
          <UISeparator
            v-if="props.isStacked"
            class="flex-1"
          />
        </UIRowLayout>

        <p
          v-if="props.description !== null"
          class="mt-sm text-xs text-tertiary"
        >
          {{ props.description }}
        </p>
      </header>

      <div
        :class="{
          'items-start': props.horizontalAlignment === 'start',
          'items-end': props.horizontalAlignment === 'end',
        }"
        class="ml-auto flex w-full flex-col overflow-hidden p-xxs"
      >
        <slot />
      </div>
    </section>
  </div>
</template>
