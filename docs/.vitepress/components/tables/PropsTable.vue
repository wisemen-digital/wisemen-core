<script setup lang="ts">
import { VcThemeProvider } from '@wisemen/vue-core-components'
import { useData } from 'vitepress'
import { computed } from 'vue'

interface PropDef {
  name?: string
  default?: boolean | string
  description?: string
  required?: boolean
  type: string
  typeSimple: string
}

interface PropsTableProps {
  data: PropDef[]
}

const props = defineProps<PropsTableProps>()
const {
  isDark,
} = useData()

const appearance = computed<'dark' | 'light'>(() => isDark.value ? 'dark' : 'light')

// Sort by required and then alphabetically by name
function sortProps(props: PropDef[]): PropDef[] {
  return props.sort((a, b) => {
    if (a.required && !b.required) {
      return -1
    }
    else if (!a.required && b.required) {
      return 1
    }
    else if (a.name && b.name) {
      return a.name.localeCompare(b.name)
    }
    else {
      return 0
    }
  })
}
</script>

<template>
  <VcThemeProvider :appearance="appearance">
    <h2 id="props">
      Props
    </h2>

    <div
      class="
        border-secondary gap-x-2xl mt-3xl grid max-h-120
        grid-cols-[1fr_2fr_1fr] overflow-auto rounded-lg border border-solid
      "
    >
      <div class="bg-secondary col-span-full grid grid-cols-subgrid">
        <div class="p-lg text-primary min-w-32 text-sm font-semibold">
          Prop
        </div>
        <div class="p-lg text-primary text-sm font-semibold">
          Description
        </div>

        <!-- <div class="p-lg text-primary font-semibold text-sm">
          Type
        </div> -->
        <div class="p-lg text-primary text-sm font-semibold">
          Default
        </div>
      </div>

      <div
        v-for="(prop, index) of sortProps(props.data)"
        :key="index"
        class="
          border-secondary py-md col-span-full grid grid-cols-subgrid
          items-start border-b text-sm
          last:border-none
        "
      >
        <div class="p-lg text-secondary truncate font-medium">
          {{ prop.name }} {{ prop.required ? '*' : '' }}
        </div>

        <div
          class="p-lg description"
          v-html="prop.description"
        />

        <!-- <div>
          <code class="break-words inline-flex whitespace-pre-wrap">
            <div
              v-if="!prop.type.startsWith('(') && !prop.type.startsWith('{')"
              class="break-words whitespace-break-spaces"
              v-html="formatTypeScriptCode(prop.type)"
            />

            <div v-else>-</div>
          </code>
        </div> -->

        <div class="p-lg">
          <code>
            {{ prop.default ?? '-' }}
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
