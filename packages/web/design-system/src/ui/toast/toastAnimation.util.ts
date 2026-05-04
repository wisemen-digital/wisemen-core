const ANIMATION_DURATION = 600
const ANIMATION_CLASS = 'animate-toast-highlight'
const animationTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export function animateToast(toastId: string): void {
  const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`)

  if (!toastElement) {
    return
  }

  const existingTimeout = animationTimeouts.get(toastId)

  if (existingTimeout) {
    clearTimeout(existingTimeout)
  }

  toastElement.classList.remove(ANIMATION_CLASS)

  // Force re-flow to restart the animation
  void toastElement.scrollTop

  toastElement.classList.add(ANIMATION_CLASS)

  const timeout = setTimeout(() => {
    toastElement.classList.remove(ANIMATION_CLASS)
    animationTimeouts.delete(toastId)
  }, ANIMATION_DURATION)

  animationTimeouts.set(toastId, timeout)
}
