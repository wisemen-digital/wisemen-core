import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    mockReset: false,
    setupFiles: [
      './vitest.setup.ts',
    ],
  },
})
