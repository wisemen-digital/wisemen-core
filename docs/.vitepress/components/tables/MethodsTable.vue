<script setup lang="ts">
import { VcThemeProvider } from '@wisemen/vue-core-components'
import { useData } from 'vitepress'
import { computed } from 'vue'

interface MethodDef {
  name: string
  description: string
  type: string
}

interface MethodsTableProps {
  data: MethodDef[]
}

const props = defineProps<MethodsTableProps>()
const {
  isDark,
} = useData()

const appearance = computed<'dark' | 'light'>(() => isDark.value ? 'dark' : 'light')

// Sort by name
function sortMethods(methods: MethodDef[]): MethodDef[] {
  return methods.sort((a, b) => a.name.localeCompare(b.name))
}
</script>

<template>
  <VcThemeProvider :appearance="appearance">
    <h2 id="methods">
      Methods
    </h2>

    <div
      class="
        border-secondary gap-x-2xl mt-3xl grid max-h-120
        grid-cols-[1fr_2fr_1fr] overflow-auto rounded-lg border border-solid
      "
    >
      <div class="bg-secondary col-span-full grid grid-cols-subgrid">
        <div class="p-lg text-primary min-w-32 text-sm font-semibold">
          Method
        </div>
        <div class="p-lg text-primary text-sm font-semibold">
          Description
        </div>
        <div class="p-lg text-primary text-sm font-semibold">
          Type
        </div>
      </div>

      <div
        v-for="(method, index) of sortMethods(props.data)"
        :key="index"
        class="
          border-secondary py-md col-span-full grid grid-cols-subgrid
          items-start border-b text-sm
          last:border-none
        "
      >
        <div class="p-lg text-secondary truncate font-medium">
          {{ method.name }}
        </div>

        <div
          class="p-lg description"
          v-html="method.description"
        />

        <div class="p-lg">
          <code>
            {{ method.type }}
          </code>
        </div>
      </div>
    </div>
  </VcThemeProvider>
</template>

<style>
.description p {
  margin: 0 !important;
}
</style>
