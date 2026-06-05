<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import {
  GroupPriority,
  useFocusedModels,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import type { RegisteredActionContext } from '@/register'

const props = defineProps<{
  actions: Action[]
  models?: RegisteredActionContext['models']
}>()

const {
  register: registerActions, unregister: unregisterActions,
} = useTemporaryActions(props.actions, GroupPriority.HOVER, true)

const {
  register: registerModels, unregister: unregisterModels,
} = useFocusedModels(computed(() => props.models ?? []))

function register(): void {
  registerActions()
  registerModels()
}

function unregister(): void {
  unregisterActions()
  unregisterModels()
}
</script>

<template>
  <Primitive
    :as-child="true"
    @mouseenter="register"
    @focusin="register"
    @mouseleave="unregister"
    @focusout="unregister"
  >
    <slot />
  </Primitive>
</template>
