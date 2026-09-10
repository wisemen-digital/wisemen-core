<script setup lang="ts">
import {
  createAction,
  setIsAuthenticated,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'
import {
  Bell01Icon,
  Edit01Icon,
  File05Icon,
  Grid01Icon,
  HelpCircleIcon,
  Home02Icon,
  LayoutAlt01Icon,
  MoonStarIcon,
  SearchMdIcon,
  SunIcon,
  UserPlus01Icon,
} from '@wisemen/vue-core-icons'
import { ref } from 'vue'

import { UIActionTrigger } from '@/ui/action-trigger'
import { UIButton } from '@/ui/button'
import { UICommandMenu } from '@/ui/command-menu'
import { useOverlay } from '@/ui/dialog'

import CommandMenuInvoicePreview from './CommandMenuInvoicePreview.vue'

const overlay = useOverlay()
const commandMenu = overlay.create(UICommandMenu)

setIsAuthenticated(true)

const theme = ref<'dark' | 'light'>('light')

const openCommandMenuAction = createAction({
  id: 'open-command-menu',
  name: 'Open command menu',
  execute: () => {
    commandMenu.open()
  },
})

useTemporaryActions([
  createAction({
    id: 'go-to-dashboard',
    name: 'Go to dashboard',
    execute: () => {},
    group: {
      name: 'Navigation',
    },
    icon: () => Home02Icon,
  }),
  createAction({
    id: 'go-to-reports',
    name: 'Go to reports',
    execute: () => {},
    group: {
      name: 'Navigation',
    },
    hint: 'Updated 2h ago',
    icon: () => Grid01Icon,
  }),

  createAction({
    id: 'edit-profile',
    name: 'Edit profile',
    execute: () => {},
    group: {
      name: 'Account',
    },
    icon: () => Edit01Icon,
    keyboardShortcut: {
      key: 'E',
      mod: true,
    },
  }),
  createAction({
    id: 'invite-member',
    name: 'Invite team member',
    group: {
      name: 'Account',
    },
    hint: '3 pending invites',
    icon: () => UserPlus01Icon,
    subActions: () => [
      createAction({
        id: 'invite-by-email',
        name: 'Invite by email',
        execute: () => {},
      }),
      createAction({
        id: 'invite-by-link',
        name: 'Invite by link',
        execute: () => {},
      }),
    ],
  }),
  createAction({
    id: 'message-jeroen',
    name: 'Message Jeroen',
    avatar: () => ({
      name: 'Jeroen VC',
      src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    }),
    execute: () => {},
    group: {
      name: 'Account',
    },
    hint: 'jeroen.vc1@icloud.com',
  }),

  createAction({
    id: 'open-settings',
    name: 'Settings',
    group: {
      name: 'Application',
    },
    icon: () => Grid01Icon,
    subActions: () => [
      createAction({
        id: 'appearance',
        name: 'Appearance',
        icon: () => LayoutAlt01Icon,
        subActions: () => [
          createAction({
            id: 'theme-light',
            name: 'Light',
            execute: () => {
              theme.value = 'light'
            },
            icon: () => SunIcon,
            selected: () => theme.value === 'light',
          }),
          createAction({
            id: 'theme-dark',
            name: 'Dark',
            execute: () => {
              theme.value = 'dark'
            },
            icon: () => MoonStarIcon,
            selected: () => theme.value === 'dark',
          }),
        ],
      }),
      createAction({
        id: 'notifications',
        name: 'Notifications',
        execute: () => {},
        icon: () => Bell01Icon,
      }),
    ],
  }),
  createAction({
    id: 'view-invoice',
    name: 'Invoice INV-1042',
    execute: () => {},
    group: {
      name: 'Recent',
      category: 'Invoices',
    },
    hint: '€1,240.00 · Due Aug 3',
    icon: () => File05Icon,
    preview: () => CommandMenuInvoicePreview,
  }),

  createAction({
    id: 'search-docs',
    name: 'Search documentation',
    forceAsRootMenu: true,
    group: {
      name: 'Help',
    },
    icon: () => SearchMdIcon,
    searchSubActionsConfig: (ctx) => {
      return {
        noResultsMessage: `No documentation found for ${ctx.searchInput}.`,
        placeholder: 'Search documentation...',
      }
    },
    subActions: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))

      return [
        createAction({
          id: 'doc-getting-started',
          name: 'Getting started',
          execute: () => {},
          group: {
            name: 'Help',
          },
        }),
        createAction({
          id: 'doc-api-reference',
          name: 'API reference',
          execute: () => {},
          group: {
            name: 'Help',
          },
        }),
        createAction({
          id: 'doc-faq',
          name: 'FAQ',
          execute: () => {},
          group: {
            name: 'Help',
          },
        }),
      ]
    },
  }),
  createAction({
    id: 'contact-support',
    name: 'Contact support',
    execute: () => {},
    group: {
      name: 'Help',
    },
    icon: () => HelpCircleIcon,
    keywords: [
      'help',
      'ticket',
      'issue',
    ],
    onlyVisibleThroughSearch: true,
  }),
])
</script>

<template>
  <div class="flex items-center justify-center p-xl">
    <UIActionTrigger
      v-slot="{ icon, keyboardShortcut, label }"
      :action="openCommandMenuAction"
      :is-current-context-only="true"
    >
      <UIButton
        :label="label"
        :keyboard-shortcut="keyboardShortcut"
        :icon-left="icon"
        @click="commandMenu.open()"
      />
    </UIActionTrigger>
  </div>
</template>
