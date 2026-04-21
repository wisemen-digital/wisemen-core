export type DetailPaneStorageStrategy = 'localStorage' | 'routeQuery'

export type DetailPaneVariant
  = | 'bordered-inline'
    | 'bordered-overlay'
    | 'full-height-inline'
    | 'full-height-overlay'

export interface DetailPaneStorage {
  key: string
  strategy: DetailPaneStorageStrategy
}

export interface DetailPaneConfig {
  isResizable?: boolean
  storage?: DetailPaneStorage | null
  variant?: DetailPaneVariant
}
