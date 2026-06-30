import { MethodDeclaration } from 'ts-morph'

export function insertMethodDecorator (
  methodDeclaration: MethodDeclaration,
  index: number,
  decoratorName: string,
  args: string[]
): void {
  const decorator = methodDeclaration.getDecorator(decoratorName)

  if (decorator == null) {
    methodDeclaration.insertDecorator(index, {
      name: decoratorName,
      arguments: args
    })
  }
}

export function addMethodDecorator (
  methodDeclaration: MethodDeclaration,
  decoratorName: string,
  args: string[]
): void {
  const decorator = methodDeclaration.getDecorator(decoratorName)

  if (decorator == null) {
    methodDeclaration.addDecorator({
      name: decoratorName,
      arguments: args
    })
  }
}
