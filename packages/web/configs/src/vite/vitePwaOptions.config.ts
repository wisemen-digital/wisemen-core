import defu from 'defu'
import type { VitePWAOptions } from 'vite-plugin-pwa'

export const DEFAULT_VITE_PWA_CONFIG: Partial<VitePWAOptions> = {
  includeAssets: [
    'favicon.ico',
    'apple-touch-icon.png',
  ],
  injectRegister: 'auto',
  manifest: {
    name: 'Wisemen Project Template',
    background_color: '#ffffff',
    display: 'fullscreen',
    icons: [
      {
        purpose: 'maskable',
        sizes: '192x192',
        src: '/web-app-manifest-192x192.png',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        sizes: '512x512',
        src: '/web-app-manifest-512x512.png',
        type: 'image/png',
      },
    ],
    short_name: 'Wisemen Project Template',
    theme_color: 'rgb(23, 23, 23)',
  },
  registerType: 'prompt',
  strategies: 'generateSW',
  workbox: {
    clientsClaim: true,
    navigateFallbackDenylist: [
      /api/,
    ],
    runtimeCaching: [
      {
        handler: 'CacheFirst',
        options: {
          cacheableResponse: {
            statuses: [
              0,
              200,
            ], // cache responses with these statuses
          },
          cacheName: 's3-images',
          expiration: {
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          matchOptions: {
            ignoreSearch: true,
          },
        },
        urlPattern: ({
          url,
        }): boolean => url.origin.includes('s3.'),
      },
    ],
  },
}

export function vitePwaConfig(config?: Partial<VitePWAOptions>): Partial<VitePWAOptions> {
  return defu(config, DEFAULT_VITE_PWA_CONFIG)
}
