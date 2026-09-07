---
title: Payload jobs
---

# Payload jobs

Wrap Payload task and workflow definitions with `withJobLogging()`. It accepts
one definition or an array and preserves the definition type.

```ts
import { withJobLogging } from '@wisemen/payload-core-observability'

export const tasks = withJobLogging([
  {
    slug: 'refresh-search-index',
    handler: async ({ job, input }) => {
      // Task implementation
    },
  },
], 'task')
```

```ts
export const workflow = withJobLogging({
  slug: 'publish-content',
  handler: async ({ job, input }) => {
    // Workflow implementation
  },
}, 'workflow')
```

## What each event contains

The wrapper emits one Evlog wide event after the handler settles. It includes:

- `operation` and `operationType` (`task` or `workflow`)
- `job.id`, queue, task slug, workflow slug, and retry count when present
- Bounded `input` (the handler input, falling back to `job.input`)
- Failure details at `error` level when the handler throws
- Event duration, which Evlog uses for tail sampling

It rethrows the original error, so wrapping a handler does not change Payload's
retry or failure behavior.

## Recommended worker sampling

Initialize Evlog in the worker and sample ordinary successful jobs sparingly.
The tail rule still keeps slow jobs, while errors are always retained.

```ts
initializeLogging({
  service: 'cms-worker',
  sampling: {
    rates: {
      info: 1,
    },
  },
})
```

Avoid logging a second full event inside every task handler. Add targeted logs
only for meaningful milestones or diagnostic context; the wrapper already
provides the execution-level event.
