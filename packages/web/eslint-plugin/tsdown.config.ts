// hypothetical tsup.config.ts for tsdown
import { defineConfig } from 'tsdown' // Assuming tsdown exports defineConfig

export default defineConfig({
  clean: true, // Clean output directory
  dts: true, // Usually, you'd want declaration files
  entry: [
    'src/index.ts',
  ],
  // ... other tsdown options you might have
})
