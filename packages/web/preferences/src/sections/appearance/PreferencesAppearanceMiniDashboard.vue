<template>
  <div
    class="
      w-full min-w-80 rounded-xl border border-solid border-secondary bg-primary
    "
  >
    <div
      class="
        flex items-center gap-x-xs border-b border-solid border-secondary p-md
      "
    >
      <div class="size-2.5 rounded-full bg-error-400" />
      <div class="size-2.5 rounded-full bg-warning-400" />
      <div class="size-2.5 rounded-full bg-success-400" />
    </div>

    <div class="grid grid-cols-[5rem_auto] p-md">
      <div class="py-xs">
        <div class="flex items-center gap-x-md">
          <div class="size-4 rounded-full bg-quaternary" />
          <div class="h-2.5 w-12 rounded-lg bg-quaternary" />
        </div>

        <div class="my-xl flex flex-col gap-y-md">
          <div
            v-for="i in 5"
            :key="i"
            class="h-2.5 w-12 rounded-lg bg-quaternary"
          />
        </div>
      </div>

      <div class="px-md py-xxs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-tertiary">
            Dashboard
          </span>

          <slot name="action">
            <div class="h-2.5 w-8 rounded-2xl bg-quaternary" />
          </slot>
        </div>

        <div class="mt-md h-28 w-full rounded-xl bg-tertiary" />
      </div>
    </div>
  </div>
</template>
