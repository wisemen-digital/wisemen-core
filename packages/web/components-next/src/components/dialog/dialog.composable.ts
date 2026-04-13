import type {
  Component,
  Ref,
} from 'vue'
import {
  computed,
  h,
  markRaw,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
} from 'vue'

import type {
  Dialog,
  DialogTriggerProps,
  GetComponentProps,
  OpenDialog,
} from '@/components/dialog/dialog.type'

export const dialogs = ref<Dialog[]>([]) as Ref<Dialog[]>

export function useDialogContainer() {
  return {
    dialogs,
  }
}

export function removeDialogFromContainer(id: string): void {
  dialogs.value = dialogs.value.filter((dialog) => dialog.id !== id)
}

export function useDialog<
  TComponent extends abstract new (...args: any) => any,
>(component: TComponent) {
  const dialogId = useId()
  const timeoutMap = new Map<string, ReturnType<typeof setTimeout>>()

  async function openDialog(attrs?: GetComponentProps<TComponent>): Promise<void> {
    // Cancel any pending removal timeout for this dialog
    const existingTimeout = timeoutMap.get(dialogId)

    if (existingTimeout) {
      clearTimeout(existingTimeout)
      timeoutMap.delete(dialogId)
    }

    const dialog = await createDialog(attrs)

    if (dialog === null) {
      return
    }

    dialogs.value.push(dialog.value)

    await nextTick()
    dialog.value.isOpen = true
  }

  function closeDialog(): void {
    const dialog = dialogs.value.find((dialog) => dialog.id === dialogId) ?? null

    if (dialog === null) {
      return
    }

    dialog.isOpen = false

    const timeoutId = setTimeout(() => {
      // TODO: check if this is needed
      timeoutMap.delete(dialogId)
    }, 300)

    timeoutMap.set(dialogId, timeoutId)
  }

  const isDialogOpen = computed<boolean>(() => {
    const dialog = dialogs.value.find((dialog) => dialog.id === dialogId) ?? null

    if (dialog === null) {
      return false
    }

    return dialog.isOpen
  })

  async function createDialog(attrs?: GetComponentProps<TComponent>): Promise<Ref<Dialog> | null> {
    const dialogWithSameId = dialogs.value.find((dialog) => dialog.id === dialogId) ?? null

    if (dialogWithSameId !== null && isDialogOpen.value) {
      console.warn(`Dialog with ID "${dialogId}" is already open`)

      return null
    }
    else if (dialogWithSameId !== null) {
      removeDialogFromContainer(dialogWithSameId.id)
    }

    await nextTick()

    const dialogComponent = computed<Component>(() => {
      return h(
        component as unknown as Component,
        {
          ...attrs,
          onClose: closeDialog,
          onClose_: closeDialog,
        },
      )
    })

    const dialogRef = ref<Dialog>({
      id: dialogId,
      isOpen: false,
      component: markRaw(dialogComponent),
    })

    return dialogRef
  }

  const triggerProps = computed<DialogTriggerProps>(() => {
    const isOpen = dialogs.value.some((dialog) => dialog.id === dialogId && dialog.isOpen)

    return {
      'id': dialogId,
      'aria-expanded': isOpen,
      'aria-haspopup': 'dialog',
      'data-state': isOpen,
    } as DialogTriggerProps
  })

  onBeforeUnmount(() => {
    closeDialog()
  })

  return {
    isOpen: isDialogOpen,
    close: closeDialog,
    open: openDialog as OpenDialog<GetComponentProps<TComponent>>,
    triggerProps,
  }
}
