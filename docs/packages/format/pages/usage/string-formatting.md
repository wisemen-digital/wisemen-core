# String Formatting

The package exposes both locale-aware string composables and general-purpose string utility helpers.

## Import

```typescript
import {
  StringFormatUtil,
  useDataFormatConfig,
  useStringFormat,
} from '@wisemen/vue-core-format'
```

## Locale-aware list formatting

`useStringFormat` uses `Intl.ListFormat` under the hood.

```typescript
const { update } = useDataFormatConfig()
const stringFormat = useStringFormat()

update({
  locale: 'en',
})

stringFormat.toList(['a', 'b', 'c'])
// 'a, b, and c'

stringFormat.toList(['a', 'b', 'c'], 'disjunction')
// 'a, b, or c'
```

## format

Returns a fallback value for `null`, `undefined`, or blank strings.

```typescript
StringFormatUtil.format('hello')
// 'hello'

StringFormatUtil.format(null)
// '-'
```

## normalizeWhitespace

Collapses repeated whitespace and trims the result.

```typescript
StringFormatUtil.normalizeWhitespace('  hello   world  ')
// 'hello world'
```

## toPrettyUrl

Simplifies URLs for display.

```typescript
StringFormatUtil.toPrettyUrl('https://www.example.com/')
// 'example.com'
```

## toSentenceCase

Converts text to sentence case.

```typescript
StringFormatUtil.toSentenceCase('hello world. goodbye world')
// 'Hello world. Goodbye world'
```

## toSlug

Builds URL-friendly slugs.

```typescript
StringFormatUtil.toSlug('Hello Wörld!')
// 'hello-world'
```

## toTitleCase

Converts words to title case.

```typescript
StringFormatUtil.toTitleCase('hello world')
// 'Hello World'
```

## truncate

Truncates the end of a string.

```typescript
StringFormatUtil.truncate('Hello world', 8)
// 'Hello w…'
```

## truncateMiddle

Truncates the middle of a string.

```typescript
StringFormatUtil.truncateMiddle('Hello world', 8)
// 'Hel…rld'
```
