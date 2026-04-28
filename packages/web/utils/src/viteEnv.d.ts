/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ENVIRONMENT: 'development' | 'local' | 'mock' | 'production' | 'staging' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
