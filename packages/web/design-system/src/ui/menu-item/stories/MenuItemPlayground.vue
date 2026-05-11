<script setup lang="ts">
import {
  Building02Icon,
  CheckIcon,
  FolderIcon,
  User01Icon,
  User02Icon,
} from '@wisemen/vue-core-icons'

import { UIMenuItem } from '@/ui/menu-item'
</script>

<template>
  <div class="grid grid-cols-3 gap-8">
    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">Label only</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem label="Apple" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">With icon</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{
            left: {
              type: 'icon',
              icon: User02Icon,
            },
          }"
          label="Apple"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">With avatar</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{
            left: {
              type: 'avatar',
              name: 'Alice Johnson',
              src: 'https://i.pravatar.cc/150?u=alice',
            },
          }"
          label="Alice Johnson"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">With description</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{
            description:
              { layout: 'block',
                value: 'alice@example.com',
              },
            left:
              { type: 'icon',
                icon: User02Icon,
              },
          }"
          label="Alice Johnson"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">Right: text</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{ right: { type: 'text',
                              text: 'Fruit' } }"
          label="Apple"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">Right: icon</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{ right: { type: 'icon',
                              icon: Building02Icon } }"
          label="Apple"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">Right: icon + text</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{ right: { type: 'icon-text',
                              icon: Building02Icon,
                              text: 'Fruit' } }"
          label="Apple"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">Right: keyboard shortcut</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{
            right: {
              keyboardShortcut: {
                key: 'K',
                meta: true,
              },
              type: 'shortcut',
            },
          }"
          label="Apple"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">With check slot</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem label="Apple (selected)">
          <template #right>
            <Component
              :is="CheckIcon"
              class="size-3.5 text-tertiary"
            />
          </template>
        </UIMenuItem>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">With dot (success)</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{ left: { type: 'dot',
                             color: 'success' } }"
          label="Apple"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">With dot (gray)</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{
            left: { type: 'dot',
                    color: 'gray' },
          }"
          label="Apple"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">Small size</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{ left: { type: 'icon',
                             icon: User01Icon } }"
          label="Apple"
          size="sm"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">Description inline</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{
            description: { layout: 'inline',
                           value: 'alice@example.com' },
          }"
          label="Alice Johnson"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">Description inline (truncates)</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{
            description: { layout: 'inline',
                           value: 'this-is-a-very-long-description-that-should-truncate@example.com' },
            right: {
              icon: Building02Icon,
              text: 'Fruit',
              type: 'icon-text',
            },
          }"
          label="Alice Johnson"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">With breadcrumbs</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{
            left: {
              type: 'breadcrumbs',
              breadcrumbs: [
                {
                  icon: Building02Icon,
                  label: 'Workspace',
                },
                {
                  icon: FolderIcon,
                  label: 'Projects',
                },
                {
                  icon: User02Icon,
                  label: 'Alice',
                },
              ],
            },
          }"
          label="Apple"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-disabled uppercase select-none">All combined</span>
      <div class="w-72 rounded-md border border-secondary bg-primary">
        <UIMenuItem
          :config="{
            description: {
              layout: 'block',
              value: 'alice@example.com',
            },
            left: {
              name: 'Alice Johnson',
              src: 'https://i.pravatar.cc/150?u=alice',
              type: 'avatar',
            },
            right: {
              type: 'text',
              text: 'Admin',
            },
          }"
          label="Alice Johnson"
        >
          <template #right>
            <Component
              :is="CheckIcon"
              class="size-3.5 text-tertiary"
            />
          </template>
        </UIMenuItem>
      </div>
    </div>
  </div>
</template>
