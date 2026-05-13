import {
  onBeforeUnmount,
  ref,
} from 'vue'

import type { Ref } from 'vue'

export type PdfObjectUrlReturn = ReturnType<typeof usePdfObjectUrl>

export function usePdfObjectUrl() {
  const url = ref<string | null>(null) as Ref<string | null>

  function revoke(): void {
    if (url.value === null) {
      return
    }

    URL.revokeObjectURL(url.value)
    url.value = null
  }

  function setBlob(blob: Blob): string {
    revoke()

    url.value = URL.createObjectURL(blob)

    return url.value
  }

  onBeforeUnmount(() => {
    revoke()
  })

  return {
    revoke,
    setBlob,
    url,
  }
}
