<script setup lang="ts">
import { AnimatePresence } from 'motion-v'
import {
  DropdownMenuSub as RekaDropdownMenuSub,
  DropdownMenuSubContent as RekaDropdownMenuSubContent,
  DropdownMenuSubTrigger as RekaDropdownMenuSubTrigger,
} from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDropdownMenuContext } from '@/components/dropdown-menu/dropdownMenu.context'
import type { DropdownMenuItemProps } from '@/components/dropdown-menu/dropdownMenu.props'
import { useProvideDropdownMenuItemContext } from '@/components/dropdown-menu/dropdownMenuItem.context'
import DropdownMenuItemIcon from '@/components/dropdown-menu/parts/DropdownMenuItemIcon.vue'
import DropdownMenuItemLabel from '@/components/dropdown-menu/parts/DropdownMenuItemLabel.vue'
import DropdownMenuPortal from '@/components/dropdown-menu/parts/DropdownMenuPortal.vue'
import DropdownMenuSubMenuTransition from '@/components/dropdown-menu/parts/DropdownMenuSubMenuTransition.vue'
import Icon from '@/components/icon/Icon.vue'
import ThemeProvider from '@/components/theme-provider/ThemeProvider.vue'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<DropdownMenuItemProps>(), {
  id: null,
  testId: null,
  isDestructive: false,
  isDisabled: false,
  icon: null,
})

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectDropdownMenuContext()

useProvideDropdownMenuItemContext(toComputedRefs(props))
</script>

<template>
  <RekaDropdownMenuSub>
    <RekaDropdownMenuSubTrigger
      :class="style.item({
        class: mergeClasses(customClassConfig.item, classConfig?.item),
      })"
    >
      <slot name="item">
        <DropdownMenuItemIcon />
        <DropdownMenuItemLabel />

        <Icon
          :class="style.subMenuArrowIcon({
            class: mergeClasses(customClassConfig.itemIcon, classConfig?.itemIcon),
          })"
          icon="chevronRight"
        />
      </slot>
    </RekaDropdownMenuSubTrigger>

    <DropdownMenuPortal>
      <AnimatePresence>
        <ThemeProvider>
          <RekaDropdownMenuSubContent
            :side-offset="6"
            :align-offset="-5"
            :class="style.content({
              class: mergeClasses(customClassConfig.content, classConfig?.content),
            })"
            :as-child="true"
          >
            <DropdownMenuSubMenuTransition>
              <slot />
            </DropdownMenuSubMenuTransition>
          </RekaDropdownMenuSubContent>
        </ThemeProvider>
      </AnimatePresence>
    </DropdownMenuPortal>
  </RekaDropdownMenuSub>
</template>
