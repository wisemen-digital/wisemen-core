const CAMEL_TO_KEBAB_REGEX_1 = /([a-z])([A-Z])/g
const CAMEL_TO_KEBAB_REGEX_2 = /([A-Z]+)([A-Z][a-z])/g

const DIACRITICS_REGEX = /[\u0300-\u036F]/g
const NON_WORD_HYPHEN_REGEX = /[^\w\s-]/g
const MULTI_SPACE_UNDERSCORE_REGEX = /[\s_]+/g
const TRIM_HYPHENS_REGEX = /^-+|-+$/g

const HTML_TAG_REGEX = /<[^>]*>/g

export class StringUtil {
  /**
   * Converts a camelCase or PascalCase string to kebab-case.
   *
   * @example
   * StringUtil.camelToKebab('myVariableName') // 'my-variable-name'
   * StringUtil.camelToKebab('MyComponent') // 'my-component'
   */
  static camelToKebab(value: string): string {
    return value
      .replace(CAMEL_TO_KEBAB_REGEX_1, '$1-$2')
      .replace(CAMEL_TO_KEBAB_REGEX_2, '$1-$2')
      .toLowerCase()
  }

  /**
   * Capitalizes the first character of a string and lowercases the rest.
   *
   * @example
   * StringUtil.capitalize('hELLO') // 'Hello'
   * StringUtil.capitalize('world') // 'World'
   */
  static capitalize(value: string): string {
    if (value.length === 0) {
      return value
    }

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }

  /**
   * Checks whether a string is empty, null, or contains only whitespace.
   *
   * @example
   * StringUtil.isEmpty('') // true
   * StringUtil.isEmpty('  ') // true
   * StringUtil.isEmpty(null) // true
   * StringUtil.isEmpty('hello') // false
   */
  static isEmpty(value?: string | null): boolean {
    return value === null || value === undefined || value.trim().length === 0
  }

  /**
   * Converts a string to a URL-friendly slug.
   * Lowercases the string, strips special characters, and replaces spaces with hyphens.
   *
   * @example
   * StringUtil.slugify('Hello World!') // 'hello-world'
   * StringUtil.slugify('  Foo & Bar  ') // 'foo-bar'
   */
  static slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(DIACRITICS_REGEX, '')
      .replace(NON_WORD_HYPHEN_REGEX, '')
      .replace(MULTI_SPACE_UNDERSCORE_REGEX, '-')
      .replace(TRIM_HYPHENS_REGEX, '')
  }

  /**
   * Strips all HTML tags from a string, returning plain text.
   *
   * @example
   * StringUtil.stripHtml('<p>Hello <b>world</b></p>') // 'Hello world'
   */
  static stripHtml(value: string): string {
    return value.replace(HTML_TAG_REGEX, '')
  }

  /**
   * Trims whitespace from a string, returning null if the result is empty.
   *
   * @example
   * StringUtil.trimOrNull('  hello  ') // 'hello'
   * StringUtil.trimOrNull('    ') // null
   * StringUtil.trimOrNull(null) // null
   */
  static trimOrNull(value: string | null): string | null {
    return value?.trim() || null
  }

  /**
   * Trims whitespace from a string, returning undefined if the result is empty.
   *
   * @example
   * StringUtil.trimOrUndefined('  hello  ') // 'hello'
   * StringUtil.trimOrUndefined('    ') // undefined
   * StringUtil.trimOrUndefined(null) // undefined
   */
  static trimOrUndefined(value: string | null): string | undefined {
    return value?.trim() || undefined
  }

  /**
   * Truncates a string to the specified maximum length, appending '...' if truncated.
   *
   * @example
   * StringUtil.truncate('Hello, world!', 5) // 'Hello...'
   * StringUtil.truncate('Hi', 10) // 'Hi'
   */
  static truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      return value
    }

    return `${value.slice(0, maxLength)}...`
  }
}
