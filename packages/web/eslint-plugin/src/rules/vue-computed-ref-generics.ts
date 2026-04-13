/* eslint-disable check-file/filename-naming-convention */
/* eslint-disable max-depth */
/* eslint-disable unicorn/consistent-function-scoping */
import type { TSESTree } from '@typescript-eslint/utils'
import {
  AST_NODE_TYPES,
  ESLintUtils,
} from '@typescript-eslint/utils'

export type MessageIds = 'missingGeneric' | 'unnecessaryGeneric'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://eslint.org/docs/latest/rules/${name}`,
)

export const vueComputedRefGenericsRule = createRule<[], MessageIds>({
  name: 'vue-computed-ref-generics',
  create(context) {
    function isComputedOrRefCall(node: TSESTree.CallExpression): boolean {
      const callee = node.callee

      if (callee.type === AST_NODE_TYPES.Identifier) {
        return callee.name === 'computed' || callee.name === 'ref'
      }

      return false
    }

    function getCallbackBody(
      callExpression: TSESTree.CallExpression,
    ): TSESTree.BlockStatement | TSESTree.Expression | null {
      const firstArg = callExpression.arguments[0]

      if (
        !firstArg
        || (firstArg.type !== AST_NODE_TYPES.ArrowFunctionExpression
          && firstArg.type !== AST_NODE_TYPES.FunctionExpression)
      ) {
        return null
      }

      return (
        firstArg as
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionExpression
      ).body
    }

    function isDirectReturnValue(node: TSESTree.Expression): boolean {
      // Allow: simple identifier (e.g., `value`, `user`)
      if (node.type === AST_NODE_TYPES.Identifier) {
        return true
      }

      // Allow: member expression (e.g., `obj.prop`, `testValue.value`)
      // but NOT method calls that transform data
      if (node.type === AST_NODE_TYPES.MemberExpression) {
        // Only allow if it's not being called as a method
        return true
      }

      // Allow: simple function call (e.g., `getValue()`, `getUser()`)
      // but NOT method calls (e.g., `array.map()`)
      if (node.type === AST_NODE_TYPES.CallExpression) {
        const callee = node.callee

        // Only allow if callee is a simple identifier, not a member expression
        return callee.type === AST_NODE_TYPES.Identifier
      }

      return false
    }

    function containsObjectLiteral(node: TSESTree.Node | null): boolean {
      if (!node) {
        return false
      }

      if (node.type === AST_NODE_TYPES.ObjectExpression) {
        return true
      }

      if (node.type === AST_NODE_TYPES.ArrayExpression) {
        // Check if array contains object literals
        return node.elements.some((element) =>
          element && containsObjectLiteral(element))
      }

      return false
    }

    function hasObjectLiteralReturn(
      node: TSESTree.BlockStatement | TSESTree.Expression | null,
    ): boolean {
      if (!node) {
        return false
      }

      // Direct object expression (arrow function with expression body)
      if (containsObjectLiteral(node)) {
        return true
      }

      // Block statement - check for return statements with object literals or arrays containing them
      if (node.type === AST_NODE_TYPES.BlockStatement) {
        for (const statement of node.body) {
          if (statement.type === AST_NODE_TYPES.ReturnStatement) {
            if (statement.argument && containsObjectLiteral(statement.argument)) {
              return true
            }
          }
        }
      }

      return false
    }

    function shouldRequireGeneric(
      node: TSESTree.CallExpression,
    ): boolean {
      const body = getCallbackBody(node)

      if (!body) {
        return false
      }

      // Check for object literals or arrays with object literals
      if (hasObjectLiteralReturn(body)) {
        return true
      }

      // Check for transformations (method calls, operations, etc)
      // Only allow direct returns of identifiers or simple function calls
      if (body.type === AST_NODE_TYPES.BlockStatement) {
        // For block statements, check return statements
        for (const statement of body.body) {
          if (statement.type === AST_NODE_TYPES.ReturnStatement) {
            if (
              statement.argument
              && !isDirectReturnValue(statement.argument)
            ) {
              return true
            }
          }
        }
      }
      else {
        // For arrow functions with expression body (not a block statement)
        if (!isDirectReturnValue(body as unknown as TSESTree.Expression)) {
          return true
        }
      }

      return false
    }

    return {
      'CallExpression[callee.name="computed"], CallExpression[callee.name="ref"]': function (
        node: TSESTree.CallExpression,
      ): void {
        if (!isComputedOrRefCall(node)) {
          return
        }

        const parent = node.parent

        // We need a parent to check for type annotations
        if (!parent) {
          return
        }

        // Only proceed if parent is a VariableDeclarator or AssignmentExpression
        if (parent.type !== AST_NODE_TYPES.VariableDeclarator && parent.type !== AST_NODE_TYPES.AssignmentExpression) {
          return
        }

        // Get the function name
        const functionName
          = (node.callee as TSESTree.Identifier).name === 'computed'
            ? 'computed'
            : 'ref'

        // Check if a generic type is provided on the CallExpression itself
        // @ts-expect-error - Some parsers may not attach typeParameters to the CallExpression,
        // so we need to check the source code as a fallback
        let hasTypeParameterOnCall = Boolean(node.typeParameters && node.typeParameters.params.length > 0)

        // If typeParameters not detected by parser, check the source code
        // This is necessary because Vue files don't always parse generics correctly
        if (!hasTypeParameterOnCall && context.sourceCode) {
          const sourceText = context.sourceCode.getText(node)

          // Look for <...> pattern before ()
          hasTypeParameterOnCall = /<[^>]+>/.test(sourceText.split('(')[0])
        }

        // Check for type annotation if this is a variable declarator
        let hasTypeAnnotation = false

        if (parent.type === AST_NODE_TYPES.VariableDeclarator) {
          const declarator = parent as TSESTree.VariableDeclarator

          hasTypeAnnotation = declarator.id.type === AST_NODE_TYPES.Identifier
            && (declarator.id as any).typeAnnotation !== undefined
        }

        // If either form of generic is provided, never report an error
        if (hasTypeParameterOnCall || hasTypeAnnotation) {
          return
        }

        // Only check if generic is needed when no generic is provided
        const needsGeneric = shouldRequireGeneric(node)

        if (needsGeneric) {
          context.report({
            messageId: 'missingGeneric',
            data: {
              functionName,
            },
            node,
          })
        }

        // Optional: warn if unnecessary generic is provided
        // if (!needsGeneric && hasTypeParameter) {
        //   context.report({
        //     node,
        //     messageId: 'unnecessaryGeneric',
        //     data: { functionName },
        //   })
        // }
      },
    }
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Require generics for computed/ref only when they return object literals',
    },
    fixable: undefined,
    messages: {
      missingGeneric:
        'Generic type is required for {{ functionName }}() when returning an object literal',
      unnecessaryGeneric:
        'Generic type is unnecessary for {{ functionName }}() when returning a value or function call',
    },
    schema: [],
    type: 'suggestion',
  },
})
