import type { Component } from 'vue'

import type { WithKeyboardShortcut } from '@/types/withKeyboardShortcut.type'

export interface DashboardPageProps {
  title: string | null
  actions?: any[]
  breadcrumbs?: PageBreadcrumb[]
  tabs?: PageTab[]
}

export interface PageTab extends WithKeyboardShortcut {
  icon?: Component
  label: string
  // @ts-expect-error no matching signature
  to: Routes[number]
}

export interface PageBreadcrumb {
  isLoading?: boolean
  icon?: Component
  imageSrc?: string
  label: string
  // @ts-expect-error no matching signature
  to?: Routes[number]
}
