<script setup lang="ts">
const props = withDefaults(defineProps<{
  horizontalValueAlignment?: 'end' | 'start'
  orientation?: 'horizontal' | 'vertical'
}>(), {
  horizontalValueAlignment: 'start',
  orientation: 'horizontal',
})
</script>

<template>
  <div
    :data-orientation="props.orientation"
    :data-horizontal-value-alignment="props.horizontalValueAlignment"
    class="
      group/detail-list-group-item flex w-full gap-xs
      data-[orientation=horizontal]:flex-col
      data-[orientation=horizontal]:items-start
      data-[orientation=vertical]:flex-col
      @[15rem]:data-[orientation=horizontal]:flex-row
      @[15rem]:data-[orientation=horizontal]:data-[horizontal-value-alignment=end]:justify-between
    "
  >
    <slot />
  </div>
</template>
