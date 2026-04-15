# Logger

The package includes an environment-aware logger:

- In development: `debug`, `info`, `warn`, and `error` are shown.
- In production: `debug` and `info` are suppressed; `warn` and `error` remain.

## Import

```typescript
import {
  Logger,
  logger,
} from '@wisemen/vue-core-utils'
```

## Singleton logger

Use the shared `logger` export for quick logs:

```typescript
logger.info('App started')
logger.warn('Low disk space')
logger.error('Failed to save', error)
```

## Prefixed logger

Create your own logger instance with a module prefix:

```typescript
const authLogger = new Logger({
  prefix: '[Auth]',
})

authLogger.info('Session restored')
authLogger.error('Session refresh failed', {
  userId,
})
```

## Log levels

```typescript
logger.debug('Debug payload', payload)
logger.info('Informational message')
logger.warn('Potential issue')
logger.error('Critical failure', error)
```