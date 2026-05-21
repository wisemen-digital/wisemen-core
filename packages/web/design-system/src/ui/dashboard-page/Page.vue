<template>
  <main
    id="main-content"
    class="
      custom-content-shadow min-h-0 flex-1 overflow-hidden rounded-xl border
      border-secondary
      dark:shadow-none
    "
  >
    <slot />
  </main>
</template>

<style scoped>
.custom-content-shadow {
  box-shadow:
    lch(0 0 0 / 0.02) 0px 3px 6px -2px,
    lch(0 0 0 / 0.04) 0px 1px 1px;
}
</style>
