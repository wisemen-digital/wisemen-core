import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

export function useIsSelectorVisible(selector: string) {
  const isSelectorVisible = ref<boolean>(false)
  let observer: MutationObserver | null = null

  function update(): void {
    isSelectorVisible.value = document.querySelector(selector) !== null
  }

  onMounted(() => {
    update()
    observer = new MutationObserver(update)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return isSelectorVisible
}
