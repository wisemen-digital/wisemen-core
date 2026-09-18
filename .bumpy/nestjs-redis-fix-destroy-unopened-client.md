---
"@wisemen/nestjs-redis": patch
---

Fix `RedisClient.onModuleDestroy` throwing `ClientClosedError` when the client never finished connecting, or was already closed. Under a large module graph, Nest can call `onModuleDestroy` on many `RedisClient` instances concurrently, some of which have not yet completed `onModuleInit`; closing an unopened or already-closed client now no-ops instead of throwing.
