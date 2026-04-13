export type DetailPaneStorageStrategy = 'localStorage' | 'routeQuery'

export interface DetailPaneStorage {
  key: string
  strategy: DetailPaneStorageStrategy
}

export interface DetailPaneConfig {
  isResizable?: boolean
  storage?: DetailPaneStorage | null
}
