<script setup lang="ts">
import {
  DropdownMenuPortal as RekaDropdownMenuPortal,
  DropdownMenuSubContent as RekaDropdownMenuSubContent,
} from 'reka-ui'

import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
</script>

<template>
  <RekaDropdownMenuPortal>
    <ThemeProvider :as-child="true">
      <RekaDropdownMenuSubContent
        :side-offset="8"
        :align-offset="-4"
        :collision-padding="5"
        data-animation="dropdown-menu-default"
        class="
          z-40 max-w-64 min-w-52
          origin-(--reka-dropdown-menu-content-transform-origin)
          will-change-[transform,opacity]
        "
      >
        <div
          class="
            relative size-full
            max-h-(--reka-dropdown-menu-content-available-height)
            overflow-hidden rounded-md border border-secondary bg-primary
            shadow-lg
          "
        >
          <slot />
        </div>
      </RekaDropdownMenuSubContent>
    </ThemeProvider>
  </RekaDropdownMenuPortal>
</template>

<style scoped>
@keyframes dropdownMenuFadeInFromTop {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.97);
  }
}

@keyframes dropdownMenuFadeInFromRight {
  from {
    opacity: 0;
    transform: translateX(-4px) scale(0.97);
  }
}

@keyframes dropdownMenuFadeInFromBottom {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
  }
}

@keyframes dropdownMenuFadeInFromLeft {
  from {
    opacity: 0;
    transform: translateX(4px) scale(0.97);
  }
}

@keyframes dropdownMenuFadeOutToTop {
  to {
    opacity: 0;
    transform: translateY(4px) scale(0.97);
  }
}

@keyframes dropdownMenuFadeOutToRight {
  to {
    opacity: 0;
    transform: translateX(-4px) scale(0.97);
  }
}

@keyframes dropdownMenuFadeOutToBottom {
  to {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
  }
}

@keyframes dropdownMenuFadeOutToLeft {
  to {
    opacity: 0;
    transform: translateX(4px) scale(0.97);
  }
}

[data-animation='dropdown-menu-default'] {
  animation-duration: 50ms;
  animation-timing-function: ease-in-out;
}

[data-animation='dropdown-menu-default'][data-state='open'][data-side='top'] {
  animation-name: dropdownMenuFadeInFromTop;
}

[data-animation='dropdown-menu-default'][data-state='open'][data-side='right'] {
  animation-name: dropdownMenuFadeInFromRight;
}

[data-animation='dropdown-menu-default'][data-state='open'][data-side='bottom'] {
  animation-name: dropdownMenuFadeInFromBottom;
}

[data-animation='dropdown-menu-default'][data-state='open'][data-side='left'] {
  animation-name: dropdownMenuFadeInFromLeft;
}

[data-animation='dropdown-menu-default'][data-state='closed'][data-side='top'] {
  animation-name: dropdownMenuFadeOutToTop;
}

[data-animation='dropdown-menu-default'][data-state='closed'][data-side='right'] {
  animation-name: dropdownMenuFadeOutToRight;
}

[data-animation='dropdown-menu-default'][data-state='closed'][data-side='bottom'] {
  animation-name: dropdownMenuFadeOutToBottom;
}

[data-animation='dropdown-menu-default'][data-state='closed'][data-side='left'] {
  animation-name: dropdownMenuFadeOutToLeft;
}
</style>
