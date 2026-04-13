interface LinkAction {
  label: string
  // @ts-expect-error no matching signature
  to: Routes[number]
  type: 'link'
}

interface ButtonAction {
  label: string
  type: 'button'
  onClick: () => void
}

export type TableRowAction = ButtonAction | LinkAction
