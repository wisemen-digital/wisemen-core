import { DecoratorStructure, MethodDeclaration, Node, OptionalKind, ts } from 'ts-morph'

interface AddMethodParamOptions {
  paramName: string
  paramType: string
  paramDecorators?: OptionalKind<DecoratorStructure>[]
}

export function addMethodParam (
  method: MethodDeclaration,
  options: AddMethodParamOptions
): void {
  const existingParams = method.getParameters()
  const paramExists = existingParams.some((param) => {
    return param.getName() === options.paramName && param.getType().getText() === options.paramType
  })

  if (paramExists) {
    return
  }

  method.addParameter({
    name: options.paramName,
    type: options.paramType,
    decorators: options.paramDecorators
  })
}

export function addMethodExpressionParam (
  method: MethodDeclaration,
  paramName: string
): void {
  const executeCall = method.getBodyOrThrow()
    .getFirstDescendantByKindOrThrow(ts.SyntaxKind.CallExpression)

  const expression = executeCall.getExpression()

  if (
    Node.isPropertyAccessExpression(expression)
    && expression.getName() === 'execute'
    && !executeCall.getArguments().some(arg => arg.getText() === paramName)
  ) {
    executeCall.addArgument(paramName)
  }
}
