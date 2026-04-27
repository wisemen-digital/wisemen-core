<script setup lang="ts">
import { Building01Icon } from '@wisemen/vue-core-icons'
import { ref } from 'vue'

import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'
import { UISelect } from '@/ui/select'
import { createSelectOptions } from '@/ui/select/select.type'

interface User {
  id: number
  name: string
  avatarSrc?: string
  email: string
}

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: string
  label?: string
  placeholder?: string
  search?: 'local' | 'remote' | null
  size?: 'md' | 'sm'
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  label: 'User',
  placeholder: 'Select a user...',
  search: null,
  size: 'md',
})

const users: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatarSrc: 'https://i.pravatar.cc/150?u=alice',
    email: 'alice@example.com',
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatarSrc: 'https://i.pravatar.cc/150?u=bob',
    email: 'bob@example.com',
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@example.com',
  },
  {
    id: 4,
    name: 'David Brown',
    avatarSrc: 'https://i.pravatar.cc/150?u=david',
    email: 'david@example.com',
  },
  {
    id: 5,
    name: 'Eva Martinez',
    email: 'eva@example.com',
  },
]

const items = createSelectOptions(users)

function getItemConfig(user: User): MenuItemConfig {
  return {
    description: `${user.email}, +32 487 74 19 54`,
    descriptionLayout: 'block' as const,
    dot: {
      color: 'pink',
    },
    label: user.name,
    right: {
      icon: Building01Icon,
      text: 'Wisemen',
      type: 'icon-text' as const,
    },
  }
}

const modelValue = ref<User | null>(null)

function displayFn(value: User): string {
  return value.name
}
</script>

<template>
  <div class="p-xl">
    <UISelect
      v-model="modelValue"
      :display-fn="displayFn"
      :error-message="props.errorMessage"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :get-item-config="getItemConfig"
      :items="items"
      :label="props.label"
      :placeholder="props.placeholder"
      :search="props.search"
      :size="props.size"
      class="w-150"
    />
  </div>
</template>
