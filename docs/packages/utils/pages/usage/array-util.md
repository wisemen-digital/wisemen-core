# Array Util

`ArrayUtil` contains common helpers for collection transformations.

## Import

```typescript
import { ArrayUtil } from '@wisemen/vue-core-utils'
```

## chunk

Splits an array into chunks of a given size.

```typescript
const result = ArrayUtil.chunk([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]
```

If `size <= 0`, an empty array is returned.

## groupBy

Groups entries by one of their keys and returns a `Map`.

```typescript
const items = [
  { type: 'book', id: 1 },
  { type: 'movie', id: 2 },
  { type: 'book', id: 3 },
]

const grouped = ArrayUtil.groupBy(items, 'type')
// Map {
//   'book' => [{ type: 'book', id: 1 }, { type: 'book', id: 3 }],
//   'movie' => [{ type: 'movie', id: 2 }]
// }
```

## sortBy

Returns a sorted copy of an array by key.

```typescript
const users = [
  { name: 'Charlie' },
  { name: 'Alice' },
  { name: 'Bob' },
]

const asc = ArrayUtil.sortBy(users, 'name')
// [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]

const desc = ArrayUtil.sortBy(users, 'name', 'desc')
// [{ name: 'Charlie' }, { name: 'Bob' }, { name: 'Alice' }]
```

## unique

Removes duplicate entries using strict equality.

```typescript
const uniqueIds = ArrayUtil.unique([1, 1, 2, 3, 3])
// [1, 2, 3]
```