/**
 * ESLint rule to verify that TypeScript property types match @Column decorator options
 *
 * Checks:
 * - If type includes `null`, @Column must have `nullable: true`
 * - If @Column has `nullable: true`, type must include `null`
 *
 * Applies to classes ending with: Column
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure @Column decorator options match TypeScript property types',
      category: 'Possible Errors',
      recommended: true
    },
    messages: {
      missingNullable: 'Property type includes null but @Column is missing `nullable: true`',
      unnecessaryNullable: '@Column has `nullable: true` but property type does not include null'
    },
    schema: []
  },

  create (context) {
    /**
     * Parse TypeScript type annotation to check for null and undefined
     */
    function parseTypeAnnotation (typeAnnotation) {
      if (!typeAnnotation) return { hasNull: false }

      const result = { hasNull: false }

      function traverse (node) {
        if (!node) return

        // Handle union types (e.g., string | null | undefined)
        if (node.type === 'TSUnionType') {
          for (const type of node.types) {
            traverse(type)
          }
        } else if (node.type === 'TSNullKeyword') {
          result.hasNull = true
        }
      }

      traverse(typeAnnotation)

      return result
    }

    /**
     * Extract @Column decorator options
     */
    function getColumnOptions (decorators) {
      if (!decorators) {
        return null
      }

      for (const decorator of decorators) {
        if (decorator.expression.type === 'CallExpression') {
          const callee = decorator.expression.callee

          // Check if it's @Column or any decorator ending with Column
          const isColumn = callee.type === 'Identifier'
            && (callee.name === 'Column' || callee.name.endsWith('Column'))
            && callee.name !== 'JoinColumn'
            && callee.name !== 'DeleteDateColumn'

          if (isColumn && decorator.expression.arguments.length > 0) {
            const options = decorator.expression.arguments[0]

            if (options.type === 'ObjectExpression') {
              const result = { nullable: false, required: true }

              for (const prop of options.properties) {
                if (prop.type === 'Property' && prop.key.type === 'Identifier') {
                  if (prop.key.name === 'nullable' && prop.value.type === 'Literal') {
                    result.nullable = prop.value.value === true
                  }
                }
              }

              return result
            }
          }
        }
      }

      return null
    }

    /**
     * Check a class property for type/decorator consistency
     */
    function checkPropertyDefinition (node) {
      // Only check properties with @Column decorator
      const columnOptions = getColumnOptions(node.decorators)

      if (!columnOptions) {
        return
      }

      // Parse the TypeScript type annotation
      const typeInfo = parseTypeAnnotation(node.typeAnnotation?.typeAnnotation)

      const { hasNull } = typeInfo
      const { nullable } = columnOptions

      // Check all four combinations for comprehensive validation
      const needsNullable = hasNull
      const hasNullable = nullable

      // Check nullable separately
      if (needsNullable && !hasNullable) {
        context.report({ node, messageId: 'missingNullable' })
      } else if (!needsNullable && hasNullable) {
        context.report({ node, messageId: 'unnecessaryNullable' })
      }
    }

    return {
      ClassDeclaration (node) {
        const className = node.id?.name

        for (const member of node.body.body) {
          if (member.type === 'PropertyDefinition') {
            checkPropertyDefinition(member, className)
          }
        }
      }
    }
  }
}
