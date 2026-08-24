import { copyFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const packageDir = fileURLToPath(new URL('..', import.meta.url))
const distDir = join(packageDir, 'dist')
const swaggerUiDir = join(distDir, 'swagger-ui')
const swaggerUiDistDir = dirname(require.resolve('swagger-ui-dist/package.json'))

await mkdir(swaggerUiDir, { recursive: true })

await Promise.all([
  copyFile(join(packageDir, 'lib', 'oauth2-redirect.html'), join(distDir, 'oauth2-redirect.html')),
  copyFile(join(packageDir, 'lib', 'wisemen-favicon.png'), join(distDir, 'favicon-16x16.png')),
  copyFile(join(packageDir, 'lib', 'wisemen-favicon.png'), join(distDir, 'favicon-32x32.png')),
  copyFile(join(swaggerUiDistDir, 'swagger-ui.css'), join(swaggerUiDir, 'swagger-ui.css')),
  copyFile(join(swaggerUiDistDir, 'swagger-ui-bundle.js'), join(swaggerUiDir, 'swagger-ui-bundle.js')),
  copyFile(join(swaggerUiDistDir, 'swagger-ui-standalone-preset.js'), join(swaggerUiDir, 'swagger-ui-standalone-preset.js'))
])
