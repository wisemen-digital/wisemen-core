/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
/* eslint-disable max-depth */
/* eslint-disable check-file/filename-naming-convention */
import type { TSESTree } from '@typescript-eslint/utils'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import {
  createRule,
  nullThrows,
} from '../util'
import type { FunctionInfo } from '../util/explicitReturnTypeUtils'
import {
  ancestorHasReturnType,
  checkFunctionReturnType,
  isValidFunctionExpressionReturnType,
} from '../util/explicitReturnTypeUtils'

export type Options = [
  {
    allowConciseArrowFunctionExpressionsStartingWithVoid?: boolean
    allowDirectConstAssertionInArrowFunctions?: boolean
    allowedNames?: string[]
    allowedRegexes?: string[]
    allowExpressions?: boolean
    allowFunctionsWithoutTypeParameters?: boolean
    allowHigherOrderFunctions?: boolean
    allowIIFEs?: boolean
    allowTypedFunctionExpressions?: boolean
  },
]
export type MessageIds = 'missingReturnType'

type FunctionNode
  = | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression

export default createRule<Options, MessageIds>({
  name: 'explicit-function-return-type',
  create(context, [
    options,
  ]) {
    const functionInfoStack: FunctionInfo<FunctionNode>[] = []

    function enterFunction(node: FunctionNode): void {
      functionInfoStack.push({
        node,
        returns: [],
      })
    }

    function popFunctionInfo(exitNodeType: string): FunctionInfo<FunctionNode> {
      return nullThrows(
        functionInfoStack.pop(),
        `Stack should exist on ${exitNodeType} exit`,
      )
    }

    function isAllowedFunction(
      node:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression,
    ): boolean {
      if (options.allowFunctionsWithoutTypeParameters && !node.typeParameters) {
        return true
      }

      if (options.allowIIFEs && isIIFE(node)) {
        return true
      }
      const hasAllowedNames = options.allowedNames?.length
      const hasAllowedRegexes = options.allowedRegexes?.length

      if (!hasAllowedNames && !hasAllowedRegexes) {
        return false
      }

      if (hasAllowedNames && options.allowedNames && checkAllowedName(node, options.allowedNames)) {
        return true
      }

      if (hasAllowedRegexes && options.allowedRegexes && checkAllowedRegexes(node, options.allowedRegexes)) {
        return true
      }

      return false
    }

    function exitFunctionExpression(
      node: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
    ): void {
      const info = popFunctionInfo('function expression')

      if (
        options.allowConciseArrowFunctionExpressionsStartingWithVoid
        && node.type === AST_NODE_TYPES.ArrowFunctionExpression
        && node.expression
        && node.body.type === AST_NODE_TYPES.UnaryExpression
        && node.body.operator === 'void'
      ) {
        return
      }

      if (isAllowedFunction(node)) {
        return
      }

      if (
        options.allowTypedFunctionExpressions
        && (isValidFunctionExpressionReturnType(node, options)
          || ancestorHasReturnType(node))
      ) {
        return
      }

      checkFunctionReturnType(info, options, context.sourceCode, (loc) =>
        context.report({

          messageId: 'missingReturnType',
          loc,
          node,
        }))
    }

    return {
      'ArrowFunctionExpression, FunctionExpression, FunctionDeclaration':
        enterFunction,
      'ArrowFunctionExpression:exit': exitFunctionExpression,
      'FunctionDeclaration:exit': function (node): void {
        const info = popFunctionInfo('function declaration')

        if (isAllowedFunction(node)) {
          return
        }
        if (options.allowTypedFunctionExpressions && node.returnType) {
          return
        }

        checkFunctionReturnType(info, options, context.sourceCode, (loc) =>
          context.report({
            messageId: 'missingReturnType',
            loc,
            node,
          }))
      },
      'FunctionExpression:exit': exitFunctionExpression,
      ReturnStatement(node): void {
        functionInfoStack.at(-1)?.returns.push(node)
      },
    }
  },
  defaultOptions: [
    {
      allowConciseArrowFunctionExpressionsStartingWithVoid: false,
      allowDirectConstAssertionInArrowFunctions: true,
      allowedNames: [],
      allowedRegexes: [],
      allowExpressions: false,
      allowFunctionsWithoutTypeParameters: false,
      allowHigherOrderFunctions: true,
      allowIIFEs: false,
      allowTypedFunctionExpressions: true,
    },
  ],
  meta: {
    docs: {
      description:
        'Require explicit return types on functions and class methods',
    },
    messages: {
      missingReturnType: 'Missing return type on function.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowConciseArrowFunctionExpressionsStartingWithVoid: {
            description:
              'Whether to allow arrow functions that start with the `void` keyword.',
            type: 'boolean',
          },
          allowDirectConstAssertionInArrowFunctions: {
            description:
              'Whether to ignore arrow functions immediately returning a `as const` value.',
            type: 'boolean',
          },
          allowedNames: {
            description:
              'An array of function/method names that will not have their arguments or return values checked.',

            items: {
              type: 'string',
            },
            type: 'array',
          },
          allowedRegexes: {
            description:
              'An array of Regexes that will not have their arguments or return values checked.',
            items: {
              type: 'string',
            },
            type: 'array',
          },

          allowExpressions: {
            description:
              'Whether to ignore function expressions (functions which are not part of a declaration).',
            type: 'boolean',
          },
          allowFunctionsWithoutTypeParameters: {
            description:
              'Whether to ignore functions that don\'t have generic type parameters.',
            type: 'boolean',
          },
          allowHigherOrderFunctions: {
            description:
              'Whether to ignore functions immediately returning another function expression.',
            type: 'boolean',
          },
          allowIIFEs: {
            description:
              'Whether to ignore immediately invoked function expressions (IIFEs).',
            type: 'boolean',
          },
          allowTypedFunctionExpressions: {
            description:
              'Whether to ignore type annotations on the variable of function expressions.',
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
})

function checkAllowedName(node:
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression, allowedNames: string[]) {
  if (
    node.type === AST_NODE_TYPES.ArrowFunctionExpression
    || node.type === AST_NODE_TYPES.FunctionExpression
  ) {
    const parent = node.parent
    let funcName

    if (node.id?.name) {
      funcName = node.id.name
    }
    else {
      switch (parent.type) {
        case AST_NODE_TYPES.VariableDeclarator: {
          if (parent.id.type === AST_NODE_TYPES.Identifier) {
            funcName = parent.id.name
          }
          break
        }
        case AST_NODE_TYPES.MethodDefinition:
        case AST_NODE_TYPES.PropertyDefinition:
        case AST_NODE_TYPES.Property: {
          if (
            parent.key.type === AST_NODE_TYPES.Identifier
            && !parent.computed
          ) {
            funcName = parent.key.name
          }
          break
        }
      }
    }
    if (Boolean(funcName) && allowedNames.includes(funcName)) {
      return true
    }
  }
  if (
    node.type === AST_NODE_TYPES.FunctionDeclaration
    && node.id
    && allowedNames.includes(node.id.name)
  ) {
    return true
  }
}

function isIIFE(
  node:
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression,
): boolean {
  return node.parent.type === AST_NODE_TYPES.CallExpression
}

function checkRegex(name: string, allowedRegexes: string[]): boolean {
  return allowedRegexes.some((regex) => {
    try {
      const re = new RegExp(regex)

      return re.test(name)
    }
    catch {
      // If the regex is invalid, we ignore it
      return false
    }
  })
}

function checkAllowedRegexes(node:
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression, allowedRegexes: string[]) {
  if (
    node.type === AST_NODE_TYPES.ArrowFunctionExpression
    || node.type === AST_NODE_TYPES.FunctionExpression
  ) {
    const parent = node.parent
    let funcName

    if (node.id?.name) {
      funcName = node.id.name
    }
    else {
      switch (parent.type) {
        case AST_NODE_TYPES.VariableDeclarator: {
          if (parent.id.type === AST_NODE_TYPES.Identifier) {
            funcName = parent.id.name
          }
          break
        }
        case AST_NODE_TYPES.MethodDefinition:
        case AST_NODE_TYPES.PropertyDefinition:
        case AST_NODE_TYPES.Property: {
          if (
            parent.key.type === AST_NODE_TYPES.Identifier
            && !parent.computed
          ) {
            funcName = parent.key.name
          }
          break
        }
      }
    }
    if (Boolean(funcName) && checkRegex(funcName, allowedRegexes)) {
      return true
    }
  }
  if (
    node.type === AST_NODE_TYPES.FunctionDeclaration
    && node.id
    && checkRegex(node.id.name, allowedRegexes)
  ) {
    return true
  }
}
