export function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}
