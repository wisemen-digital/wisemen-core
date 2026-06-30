import { ClassDeclaration, MethodDeclaration } from 'ts-morph'

export function getPublicMethod (
  classDeclaration: ClassDeclaration
): MethodDeclaration {
  return classDeclaration.getMethodOrThrow(opt => opt.hasModifier('public'))
}
