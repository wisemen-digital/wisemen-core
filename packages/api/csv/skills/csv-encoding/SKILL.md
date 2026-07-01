---
name: csv-encoding
description: Use when generating CSVs in APIs.
---

# @wisemen/csv - CSV Encoding

Use `@wisemen/csv` when you need to turn row objects into CSV text or a
readable CSV stream. The package exposes two encoding paths:

- `CSV.encode(records, options)` returns one CSV string.
- `CSV.encodeStream(records, options)` returns a `Readable` that yields CSV
  chunks.

Pick `encode()` for small, already-materialized arrays. Pick `encodeStream()`
when rows come from an iterable or async iterable, or when the response should
be streamed.

## Encode A CSV String

```ts
import { CSV } from '@wisemen/csv'

const csv = CSV.encode(
  [
    { name: 'John Doe', age: '30' },
    { name: 'Jane Doe', age: '25' },
  ],
  { columns: ['name', 'age'] }
)
```

This returns:

```txt
name;age
John Doe;30
Jane Doe;25
```

## Encode A CSV Stream

```ts
import { CSV } from '@wisemen/csv'

const stream = CSV.encodeStream(sourceRows, {
  columns: ['name', 'age'],
})
```

Use the stream variant for HTTP downloads and large exports. The output still
contains the header row first, but the CSV is emitted in chunks instead of one
fully buffered string.

## Encoding Rules To Rely On

- The default delimiter is `;`.
- Set `delimiter` to override it, including multi-character delimiters.
- `columns` controls both header order and field order.
- `CSV.encode()` derives `columns` from the first record when they are omitted.
- `CSV.encodeStream()` also derives `columns` from the first emitted record when
  they are omitted.
- `null` and `undefined` are encoded as empty fields.
- Values containing the delimiter, `"` or a newline are wrapped in quotes.
- Inner `"` characters are escaped as `""`.
- `encode()` does not add a trailing newline after the last row.
- `encodeStream()` writes `\n` after the header and after every emitted row.

## Stream-Specific Behavior

- `encodeStream()` accepts both `Iterable<Record<...>>` and
  `AsyncIterable<Record<...>>`.
- `batchSize` controls how many data rows are buffered before a chunk is
  yielded.
- `maxChunkBytes` forces a chunk flush once the buffered CSV text reaches the
  configured byte size.
- If both limits are set, whichever limit is hit first flushes the chunk.
- If the iterable is empty and `columns` are provided, the stream emits only the
  header row.
- If the iterable is empty and `columns` are omitted, the stream emits nothing.
