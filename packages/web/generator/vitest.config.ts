import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    mockReset: false,
    setupFiles: [
      'vitest-localstorage-mock',
    ],
  },
})
