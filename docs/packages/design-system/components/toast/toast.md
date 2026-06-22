<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/toast/stories/ToastDefaultPlayground.vue'

</script>

# Toast

Toast notification content used with the design-system toast utilities.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-toast--default)

## Usage

Toast is composable-based — there is no component to place in the template. Call `useToast()` and trigger notifications imperatively.

```vue
<script setup lang="ts">
import { CheckCircleIcon } from '@wisemen/vue-core-icons'
import { useToast } from '@wisemen/vue-core'

const toast = useToast()

function onSave() {
  toast.show({
    icon: CheckCircleIcon,
    message: 'Changes saved successfully.',
    variant: 'info',
  })
}
</script>
```

### Promise toast

Show a loading state that automatically transitions to success or error:

```ts
toast.promise({
  promise: saveUser(),
  loading: 'Saving...',
  success: 'User saved.',
  error: 'Failed to save user.',
})
```

## API

<!-- @include: ./toast-meta.md -->
