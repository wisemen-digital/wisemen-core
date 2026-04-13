<script setup lang="ts">
import { h } from 'vue'

import ConfigProvider from '@/components/config-provider/ConfigProvider.vue'
import TestImage from '@/components/toast/stories/TestImage.vue'
import { useToast } from '@/components/toast/toast.composable'
import ToastContainer from '@/components/toast/ToastContainer.vue'

const toast = useToast()

setTimeout(() => {
  toast.info({
    title: 'Changes saved',
    description: 'Your changes have been saved successfully.',
  })
}, 1000)

setTimeout(() => {
  toast.error({
    title: 'Oops, something went wrong',
    description: 'It looks like something went wrong. No worries, your data isn\'t lost.',
  })
}, 2000)

setTimeout(() => {
  toast.success({
    title: 'It worked!',
    description: 'We solved the issue, you are welcome.',
  })
}, 3000)

setTimeout(() => {
  toast.info({
    title: 'Ria updated her profile picture',
    actions: [
      {
        label: 'View info',
        variant: 'secondary',
        onClick: (close): void => {
          close()
        },
      },
    ],
    description: 'Ria just updated her profile picture. Check it out!',
    preview: h(TestImage),
  })
}, 3000)
</script>

<template>
  <Story title="Toast">
    <ConfigProvider
      teleport-target-selector="#teleport-target"
      locale="en-NL"
    >
      <ToastContainer />

      <div id="teleport-target" />
    </ConfigProvider>
  </Story>
</template>
