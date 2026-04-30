# String Util

`StringUtil` provides practical string formatting and normalization helpers.

## Import

```typescript
import { StringUtil } from '@wisemen/vue-core-utils'
```

## camelToKebab

Converts camelCase or PascalCase values to kebab-case.

```typescript
StringUtil.camelToKebab('myVariableName')
// 'my-variable-name'

StringUtil.camelToKebab('MyComponent')
// 'my-component'
```

## capitalize

Uppercases the first character and lowercases the rest.

```typescript
StringUtil.capitalize('hELLO')
// 'Hello'
```

## isEmpty

Checks if a string is `null`, `undefined`, empty, or whitespace-only.

```typescript
StringUtil.isEmpty('') // true
StringUtil.isEmpty('   ') // true
StringUtil.isEmpty(null) // true
StringUtil.isEmpty('value') // false
```

## slugify

Converts text into URL-friendly slugs.

```typescript
StringUtil.slugify('Hello World!')
// 'hello-world'

StringUtil.slugify('Crème brûlée')
// 'creme-brulee'
```

## stripHtml

Removes HTML tags from a string.

```typescript
StringUtil.stripHtml('<p>Hello <b>world</b></p>')
// 'Hello world'
```

## truncate

Truncates text and appends `...` when needed.

```typescript
StringUtil.truncate('Hello, world!', 5)
// 'Hello...'

StringUtil.truncate('Hi', 10)
// 'Hi'
```