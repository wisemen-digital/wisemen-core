/**
 * String utilities for code generation
 */

const PASCAL_CASE_SEPARATOR_REGEX = /([_-]+|\s+)([a-z0-9])/gi
const FIRST_LOWERCASE_REGEX = /^[a-z]/
const NON_WORD_REGEX = /\W/g
const UI_PREFIX_REGEX = /^UI([A-Z])/g
const API_PREFIX_REGEX = /^API([A-Z])/g
const HTTP_PREFIX_REGEX = /^HTTP([A-Z])/g
const URL_PREFIX_REGEX = /^URL([A-Z])/g
const ID_PREFIX_REGEX = /^ID([A-Z])/g
const VALID_IDENTIFIER_REGEX = /^[a-z_]\w*$/i

/**
 * Converts a string to PascalCase
 * @param str - Input string
 * @returns PascalCase string
 */
export function toPascal(str: string): string {
  return str
    .replace(PASCAL_CASE_SEPARATOR_REGEX, (_, __, c) => c.toUpperCase())
    .replace(FIRST_LOWERCASE_REGEX, (c) => c.toUpperCase())
}

/**
 * Creates a safe TypeScript type name by removing invalid characters
 * @param name - Input name
 * @returns Safe type name
 */
export function safeTypeName(name: string): string {
  return name.replace(NON_WORD_REGEX, '_')
}

/**
 * Normalizes common type name prefixes (UI -> Ui, API -> Api, etc.)
 * @param typeName - Input type name
 * @returns Normalized type name
 */
export function normalizeTypeName(typeName: string): string {
  return typeName
    .replace(UI_PREFIX_REGEX, 'Ui$1')
    .replace(API_PREFIX_REGEX, 'Api$1')
    .replace(HTTP_PREFIX_REGEX, 'Http$1')
    .replace(URL_PREFIX_REGEX, 'Url$1')
    .replace(ID_PREFIX_REGEX, 'Id$1')
}

/**
 * Checks if a property name is a valid JavaScript identifier
 * @param key - Property name to check
 * @returns True if valid identifier
 */
export function isValidIdentifier(key: string): boolean {
  return VALID_IDENTIFIER_REGEX.test(key)
}

/**
 * Makes a property name safe for code generation
 * @param key - Property name
 * @returns Quoted key if needed, otherwise raw key
 */
export function safePropName(key: string): string {
  return isValidIdentifier(key) ? key : `"${key}"`
}
