import { ActionType, AddActionConfig, CustomActionFunction } from 'plop'
import { ActionPart, ActionPartFile } from './builder.type.js'

export class Builder {
  private actions: ActionPart[] = []

  public build (): ActionType[] {
    return this.actions.map(action => action.action)
  }

  public addFile (name: string, action: Omit<AddActionConfig, 'type'>): void {
    this.actions.push({
      type: 'file',
      name,
      path: action.path,
      action: {
        type: 'add',
        ...action
      }
    })
  }

  public addManipulation (action: CustomActionFunction): void {
    this.actions.push({
      type: 'manipulation',
      action
    })
  }

  public getPathOrThrow (name: string): string {
    const path = this.getPath(name)

    if (path == null) {
      throw new Error(`File with name "${name}" not found`)
    }

    return path
  }

  public getPath (name: string): string | null {
    const action = this.actions.find((action): action is ActionPartFile => {
      return action.type === 'file' && action.name === name
    })

    if (action == null) {
      return null
    }

    return action.path
  }
}
