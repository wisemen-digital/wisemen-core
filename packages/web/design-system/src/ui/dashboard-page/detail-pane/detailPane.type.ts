export type RemValue = `${number}rem`

export type DetailPaneStorageStrategy = 'localStorage' | 'routeQuery'

export type DetailPaneVariant = | 'bordered-inline' | 'bordered-overlay' | 'full-height-inline' | 'full-height-overlay'

export interface DetailPaneStorage {
  key: string
  strategy: DetailPaneStorageStrategy
}

export interface DetailPaneConfig {
  isResizable?: boolean
  isToggleHidden?: boolean
  defaultWidth?: RemValue
  maxWidth?: RemValue
  minWidth?: RemValue
  storage?: DetailPaneStorage | null
  variant?: DetailPaneVariant
}
