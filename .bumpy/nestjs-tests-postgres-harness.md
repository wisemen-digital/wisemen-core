---
'@wisemen/nestjs-tests': minor
---

Add a `./postgres` export with a reusable PostgreSQL test harness.

`PostgresTestSetup` isolates each package/worker in its own schema so suites can run in parallel without sharing fixtures, and supports per-test rollback. `PostgresConcurrentTestSetup` opens two real backends with distinct PIDs for lock and lease races, with `inTransactionFor` and `isBlocked` helpers.

The `typeorm` peer range widens to `>=0.3.31 <2` so consumers on either TypeORM line can use the harness. Also corrects the package's `repository.directory`, which pointed at `nestjs-nats`.
