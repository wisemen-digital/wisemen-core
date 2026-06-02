<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from 'reka-ui'

import { UIRowLayout } from '@/ui/row-layout/index'
import TableSubgrid from '@/ui/table/components/TableSubgrid.vue'
import { TABLE_Z_INDEX } from '@/ui/table/const/table.const'
import { useProvideTableSubGroupContext } from '@/ui/table/context/tableSubGroup.context'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  defaultOpen?: boolean
  label: string
}>(), {
  defaultOpen: true,
})

useProvideTableSubGroupContext({
  isSubGroup: true,
})
</script>

<template>
  <CollapsibleRoot
    v-slot="{ open: isOpen }"
    :as="TableSubgrid"
    :default-open="props.defaultOpen"
  >
    <div
      :style="{
        zIndex: TABLE_Z_INDEX.SUBGROUP,
      }"
      class="
        group/sub-group sticky top-18 col-span-full flex h-8 items-center
        bg-primary
      "
    >
      <CollapsibleTrigger :as-child="true">
        <button
          class="
            size-full px-5xl outline-none
            focus-visible:bg-tertiary
          "
        >
          <UIRowLayout gap="none">
            <div class="w-5">
              <ChevronDownIcon
                :class="{
                  '-rotate-90': !isOpen,
                }"
                class="
                  size-3.5 text-disabled duration-150
                  group-hover/sub-group:text-secondary
                "
              />
            </div>

            <UIText
              :text="props.label"
              class="
                text-xs text-tertiary duration-150
                group-hover/sub-group:text-secondary
              "
            />
          </UIRowLayout>
        </button>
      </CollapsibleTrigger>
    </div>

    <CollapsibleContent
      :as="TableSubgrid"
      class="
        origin-top-left overflow-clip
        data-[state=closed]:animate-[table-collapsible-up_150ms]
        data-[state=open]:animate-[table-collapsible-down_150ms]
      "
    >
      <slot />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
