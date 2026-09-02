import { ActionType } from 'plop'

export interface ActionPartManipulation {
  type: 'manipulation'
  action: ActionType
}

export interface ActionPartFile {
  type: 'file'
  name: string
  path: string
  action: ActionType
}

export type ActionPart = ActionPartManipulation | ActionPartFile
