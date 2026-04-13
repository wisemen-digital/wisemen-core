import type { Component } from 'vue'

export const icons = {
  expand: import('./ExpandIcon.vue'),
  fontSize: import('./FontSizeIcon.vue'),
  shrink: import('./ShrinkIcon.vue'),
} satisfies Record<string, Component>

type CustomIcons = {
  [K in keyof typeof icons]: Component
}

declare module '@wisemen/vue-core-components' {
  interface Icons extends CustomIcons {}
}
