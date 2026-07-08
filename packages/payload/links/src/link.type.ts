/* eslint-disable unicorn/no-keyword-prefix */
export interface LinkReferenceValue {
  id?: string | null
  slug?: string | null
}

export interface LinkFieldDocument {
  newTab?: boolean | null
  reference?: {
    relationTo?: 'articles' | 'pages' | null
    value?: string | LinkReferenceValue | null
  } | null
  type: 'custom' | 'reference'
  url?: string | null
}
