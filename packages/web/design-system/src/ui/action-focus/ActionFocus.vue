<script setup lang="ts">
import type {
  Action,
  ActionModel,
} from '@wisemen/vue-core-actions'
import {
  GroupPriority,
  useFocusedModels,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

const props = defineProps<{
  actions: Action[]
  models?: ActionModel[]
}>()

const {
  register, unregister,
} = useTemporaryActions(props.actions, GroupPriority.HOVER, true)

useFocusedModels(computed(() => props.models ?? []))
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
