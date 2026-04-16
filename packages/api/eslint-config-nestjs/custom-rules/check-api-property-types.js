import ts from 'typescript'

/**
 * ESLint rule to verify that TypeScript property types match @ApiProperty decorator options
 *
 * Checks:
 * - If type includes `null`, @ApiProperty must have `nullable: true`
 * - If type includes `undefined`, @ApiProperty must have `required: false`
 * - If @ApiProperty has `nullable: true`, type must include `null`
 * - If @ApiProperty has `required: false`, type must include `undefined` or property must have a default value
 * - If property type is a branded UUID, @ApiProperty must have `type: String` and `format: 'uuid'`
 *
 * Applies to classes ending with: Response, Command, Query
 */

export default {
  meta: {
    type: /** @type {'problem'} */ ('problem'),
    docs: {
      description: 'Ensure @ApiProperty decorator options match TypeScript property types',
      category: 'Possible Errors',
      recommended: true
    },
    messages: {
      missingNullable: 'Property type includes null but @ApiProperty is missing `nullable: true`',
      missingRequired: 'Property type includes undefined but @ApiProperty is missing `required: false`',
      unnecessaryNullable: '@ApiProperty has `nullable: true` but property type does not include null',
      unnecessaryRequired: '@ApiProperty has `required: false` but property type does not include undefined',
      missingBothNullableRequired: 'Property type includes null and undefined but @ApiProperty is missing both `nullable: true` and `required: false`',
      unnecessaryBothNullableRequired: '@ApiProperty has both `nullable: true` and `required: false` but property type does not include both null and undefined',
      missingIsArray: 'Property type is an array but @ApiProperty is missing `isArray: true`',
      unnecessaryIsArray: '@ApiProperty has `isArray: true` but property type is not an array',
      missingUuidType: 'Branded UUID properties must use `type: String` in @ApiProperty',
      missingUuidFormat: 'Branded UUID properties must use `format: \'uuid\'` in @ApiProperty',
      missingUuidTypeAndFormat: 'Branded UUID properties must use `type: String` and `format: \'uuid\'` in @ApiProperty'
    },
    schema: []
  },

  create (context) {
    /**
     * Check if a class name matches the patterns we care about
     */
    const parserServices = context.sourceCode.parserServices
    const checker = parserServices?.program?.getTypeChecker?.()
    
    function isTargetClass (className) {
      if (!className) return false

      return className.endsWith('Response')
        || className.endsWith('Command')
        || className.endsWith('Query')
        || className.endsWith('Event')
    }

    /**
     * Parse TypeScript type annotation to check for null and undefined
     */
    function parseTypeAnnotation (typeAnnotation) {
      if (!typeAnnotation) return { hasNull: false, hasUndefined: false, hasArray: false }

      const result = { hasNull: false, hasUndefined: false, hasArray: false }

      function traverse (node) {
        if (!node) return

        // Handle union types (e.g., string | null | undefined)
        if (node.type === 'TSUnionType') {
          for (const type of node.types) {
            traverse(type)
          }
        } else if (node.type === 'TSArrayType') {
          result.hasArray = true
          traverse(node.elementType)
        } else if (node.type === 'TSTypeReference') {
          const typeName = node.typeName
          const isArrayRef = typeName?.type === 'Identifier' && typeName.name === 'Array'

          if (isArrayRef) {
            result.hasArray = true

            const typeParams = node.typeParameters

            if (typeParams?.params?.length) {
              for (const param of typeParams.params) {
                traverse(param)
              }
            }
          }
        } else if (node.type === 'TSNullKeyword') {
          result.hasNull = true
        } else if (node.type === 'TSUndefinedKeyword') {
          result.hasUndefined = true
        }
      }

      traverse(typeAnnotation)

      return result
    }

    function unwrapExpression (node) {
      let current = node

      while (
        current?.type === 'TSAsExpression'
        || current?.type === 'TSSatisfiesExpression'
        || current?.type === 'ParenthesizedExpression'
      ) {
        current = current.expression
      }

      return current
    }

    function getPropertyKeyName (property) {
      if (property.key.type === 'Identifier') {
        return property.key.name
      }

      if (property.key.type === 'Literal' && typeof property.key.value === 'string') {
        return property.key.value
      }

      return null
    }

    function isApiPropertyDecorator (decorator) {
      if (decorator.expression.type !== 'CallExpression') {
        return false
      }

      const callee = decorator.expression.callee

      return callee.type === 'Identifier'
        && (callee.name === 'ApiProperty' || callee.name.endsWith('ApiProperty'))
    }

    function isStringConstructorExpression (node) {
      const value = unwrapExpression(node)

      return value?.type === 'Identifier' && value.name === 'String'
    }

    function isUuidFormatExpression (node) {
      const value = unwrapExpression(node)

      return value?.type === 'Literal' && value.value === 'uuid'
    }

    function isNullishType (type) {
      return (type.flags & ts.TypeFlags.Null) !== 0
        || (type.flags & ts.TypeFlags.Undefined) !== 0
    }

    function isStringLikeType (type) {
      return (type.flags & ts.TypeFlags.StringLike) !== 0
    }

    function getTypeProperty (type, propertyName, tsNode) {
      if (!checker || !tsNode) {
        return null
      }

      const property = checker.getPropertyOfType(type, propertyName)

      if (!property) {
        return null
      }

      return checker.getTypeOfSymbolAtLocation(property, tsNode)
    }

    function isUuidBrandType (type) {
      return (type.flags & ts.TypeFlags.StringLiteral) !== 0 && type.value === 'uuid'
    }

    function isUuidMarkerType (type) {
      return isStringLikeType(type)
    }

    function isBrandedUuidType (type, tsNode) {
      if (type.isUnion()) {
        return type.types.some(member => !isNullishType(member) && isBrandedUuidType(member, tsNode))
      }

      if (!type.isIntersection()) {
        return false
      }

      const hasBaseStringType = type.types.some(isStringLikeType)

      if (!hasBaseStringType) {
        return false
      }

      const brandType = getTypeProperty(type, '__brand', tsNode)
      const uuidType = getTypeProperty(type, '__uuid', tsNode)

      return brandType != null
        && uuidType != null
        && isUuidBrandType(brandType)
        && isUuidMarkerType(uuidType)
    }

    function isBrandedUuidProperty (node) {
      if (!checker || !parserServices?.esTreeNodeToTSNodeMap) {
        return false
      }

      try {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node)

        if (!tsNode) {
          return false
        }

        const type = checker.getTypeAtLocation(tsNode)

        return isBrandedUuidType(type, tsNode)
      } catch {
        return false
      }
    }

    /**
     * Extract @ApiProperty decorator options
     */
    function getApiPropertyOptions (decorators) {
      if (!decorators) {
        return null
      }

      for (const decorator of decorators) {
        if (!isApiPropertyDecorator(decorator) || decorator.expression.arguments.length === 0) {
          continue
        }

        const options = unwrapExpression(decorator.expression.arguments[0])

        if (options?.type === 'ObjectExpression') {
          const result = {
            nullable: false,
            required: true,
            isArray: false,
            hasStringType: false,
            hasUuidFormat: false
          }

          for (const prop of options.properties) {
            if (prop.type !== 'Property') {
              continue
            }

            const keyName = getPropertyKeyName(prop)

            if (!keyName) {
              continue
            }

            const value = unwrapExpression(prop.value)

            if (keyName === 'nullable' && value?.type === 'Literal') {
              result.nullable = value.value === true
            }
            if (keyName === 'required' && value?.type === 'Literal') {
              result.required = value.value !== false
            }
            if (keyName === 'isArray' && value?.type === 'Literal') {
              result.isArray = value.value === true
            }
            if (keyName === 'type') {
              result.hasStringType = isStringConstructorExpression(value)
            }
            if (keyName === 'format') {
              result.hasUuidFormat = isUuidFormatExpression(value)
            }
          }

          return result
        }
      }

      return null
    }

    /**
     * Check a class property for type/decorator consistency
     */
    function checkPropertyDefinition (node) {
      // Only check properties with @ApiProperty decorator
      const apiPropertyOptions = getApiPropertyOptions(node.decorators)

      if (!apiPropertyOptions) {
        return
      }

      // Parse the TypeScript type annotation
      const typeInfo = parseTypeAnnotation(node.typeAnnotation?.typeAnnotation)

      const { hasNull, hasUndefined, hasArray } = typeInfo
      const { nullable, required, isArray, hasStringType, hasUuidFormat } = apiPropertyOptions

      // Check if property uses optional syntax (?:) which implicitly adds undefined
      const typeHasUndefined = hasUndefined || node.optional === true

      // Check if property has a default value (initializer)
      const hasDefaultValue = node.value != null

      // Check all four combinations for comprehensive validation
      const needsNullable = hasNull
      const hasNullable = nullable
      const needsRequired = typeHasUndefined
      const hasRequired = !required
      const needsArray = hasArray
      const hasIsArray = isArray

      // Check if both null and undefined are needed/present
      if (needsNullable && needsRequired) {
        if (!hasNullable || !hasRequired) {
          context.report({ node, messageId: 'missingBothNullableRequired' })
        }
      } else if (hasNullable && hasRequired) {
        // When checking if required: false is unnecessary, allow it if there's a default value
        if (!needsNullable || (!needsRequired && !hasDefaultValue)) {
          context.report({ node, messageId: 'unnecessaryBothNullableRequired' })
        }
      } else {
        // Check nullable separately
        if (needsNullable && !hasNullable) {
          context.report({ node, messageId: 'missingNullable' })
        } else if (!needsNullable && hasNullable) {
          context.report({ node, messageId: 'unnecessaryNullable' })
        }

        // Check required separately
        if (needsRequired && !hasRequired) {
          context.report({ node, messageId: 'missingRequired' })
        } else if (!needsRequired && hasRequired && !hasDefaultValue) {
          // Only report unnecessaryRequired if there's no default value
          context.report({ node, messageId: 'unnecessaryRequired' })
        }
      }

      if (needsArray && !hasIsArray) {
        context.report({ node, messageId: 'missingIsArray' })
      } else if (!needsArray && hasIsArray) {
        context.report({ node, messageId: 'unnecessaryIsArray' })
      }

      if (!isBrandedUuidProperty(node)) {
        return
      }

      const needsUuidType = !hasStringType
      const needsUuidFormat = !hasUuidFormat

      if (needsUuidType && needsUuidFormat) {
        context.report({ node, messageId: 'missingUuidTypeAndFormat' })
      } else if (needsUuidType) {
        context.report({ node, messageId: 'missingUuidType' })
      } else if (needsUuidFormat) {
        context.report({ node, messageId: 'missingUuidFormat' })
      }
    }

    return {
      ClassDeclaration (node) {
        const className = node.id?.name

        if (!isTargetClass(className)) {
          return
        }

        for (const member of node.body.body) {
          if (member.type === 'PropertyDefinition') {
            checkPropertyDefinition(member, className)
          }
        }
      }
    }
  }
}
