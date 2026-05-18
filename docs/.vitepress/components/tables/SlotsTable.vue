<script setup lang="ts">
import { VcThemeProvider } from '@wisemen/vue-core-components'
import { useData } from 'vitepress'
import { computed } from 'vue'

interface SlotDef {
  name: string
  description: string
  type: string
}

interface SlotsTableProps {
  data: SlotDef[]
}

const props = defineProps<SlotsTableProps>()
const {
  isDark,
} = useData()

const appearance = computed<'dark' | 'light'>(() => isDark.value ? 'dark' : 'light')

function sortSlots(slots: SlotDef[]): SlotDef[] {
  return slots.sort((a, b) => a.name.localeCompare(b.name))
}

function formatDescription(description: string): string {
  return description.trim() || '<p>-</p>'
}
</script>

<template>
  <VcThemeProvider :appearance="appearance">
    <h2 id="slots">
      Slots
    </h2>

    <div
      class="
        border-secondary gap-x-2xl mt-3xl grid max-h-120
        grid-cols-[1fr_2fr_1fr] overflow-auto rounded-lg border border-solid
      "
    >
      <div class="bg-secondary col-span-full grid grid-cols-subgrid">
        <div class="p-lg text-primary min-w-32 text-sm font-semibold">
          Slot
        </div>
        <div class="p-lg text-primary text-sm font-semibold">
          Description
        </div>
        <div class="p-lg text-primary text-sm font-semibold">
          Slot Props
        </div>
      </div>

      <div
        v-for="(slot, index) of sortSlots(props.data)"
        :key="index"
        class="
          border-secondary py-md col-span-full grid grid-cols-subgrid
          items-start border-b text-sm
          last:border-none
        "
      >
        <div class="p-lg text-secondary truncate font-medium">
          {{ slot.name }}
        </div>

        <div
          class="p-lg description"
          v-html="formatDescription(slot.description)"
        />

        <div class="p-lg">
          <code>
            {{ slot.type }}
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
