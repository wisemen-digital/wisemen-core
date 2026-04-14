<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import { UIText } from '@/ui/text/index'
import type { TextProps } from '@/ui/text/text.props'

const props = withDefaults(defineProps<{
  as?: TextProps['as']
  disableTooltip?: boolean
  text?: string
  truncate?: TextProps['truncate']
}>(), {
  as: 'span',
  disableTooltip: false,
  text: 'Hello World',
  truncate: undefined,
})

const longText = 'This is a long piece of text that should be truncated when it overflows its container. It keeps going and going to demonstrate the truncation behavior of the Text component.'
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Interactive
      </p>
      <div class="w-64">
        <UIText
          :as="props.as"
          :disable-tooltip="props.disableTooltip"
          :text="props.text"
          :truncate="props.truncate"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Truncated (single line)
      </p>
      <div class="w-64">
        <UIText
          :text="longText"
          :truncate="true"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Multi-line clamp (2 lines)
      </p>
      <div class="w-64">
        <UIText
          :text="longText"
          :truncate="2"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        As heading (h1)
      </p>
      <div class="w-64">
        <UIText
          as="h1"
          class="text-xl font-bold"
          text="This is a heading element"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        As paragraph (p) with 3-line clamp
      </p>
      <div class="w-64">
        <UIText
          :truncate="3"
          :text="longText"
          as="p"
        />
      </div>
    </div>
  </div>
</template>
