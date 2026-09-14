# @wisemen/nestjs-push

Provider-neutral push contracts, a durable installation registry, and an optional Firebase Cloud Messaging adapter.

Import the installation API from `@wisemen/nestjs-push`. Import FCM only from `@wisemen/nestjs-push/fcm`; that subpath requires the optional `firebase-admin` peer. Tests that do not need the SDK can use `FakePushProvider` from `@wisemen/nestjs-push/testing`.

```ts
FcmPushModule.forRoot({ appName: 'my-api', projectId: 'my-firebase-project' })
```

Credentials use Firebase Application Default Credentials. Never pass service-account JSON through module options.

`FirebaseMessagingGateway` implements the Firebase SDK calls behind the abstract `FirebaseMessagingGatewayPort` injection token. Both are exported from `@wisemen/nestjs-push/fcm`. To test the adapter without contacting Firebase, override `FirebaseMessagingGatewayPort` with `FakeFirebaseMessagingGateway` from `@wisemen/nestjs-push/fcm/testing`.

## Firebase app configuration

`projectId` deterministically selects the project used in the FCM send URL, instead of letting the SDK infer one from Application Default Credentials or from `GOOGLE_CLOUD_PROJECT`. It is **not** validated when the module starts: this package initializes Firebase lazily, `initializeApp` never contacts Google, and Application Default Credentials are not resolved until the first send. A project or credential mismatch therefore first appears on that send, as `SENDER_ID_MISMATCH`, which this package classifies as a configuration failure — non-retryable, and never revoking a registration. If you want misconfiguration to surface before real traffic, send a `dryRun` message during deployment verification; the package does not add a startup network call of its own.

`appName` selects or creates a named Firebase app. An app that already exists under that name is **reused as it is, without checking its project**, and only an app this gateway created itself is deleted on module destroy. Use a name specific to this module unless sharing an app with other Firebase consumers in the process is intentional.

## Sending

The FCM adapter sends visible notifications only. `PushMessage` requires a title and a body, every message carries a `notification` block, and the APNs push type is always `alert`. Data-only background pushes are unsupported: Firebase requires APNs priority 5 for data messages to Apple devices and rejects a high priority one with `INVALID_ARGUMENT`.

Batching is chunked to 500 targets per call, which is an Admin SDK limit. At most four calls are in flight at once, which is our backpressure choice — Firebase publishes no concurrency cap, only per-project message rates.

Retries use exponential backoff from 30 seconds with ±20% jitter, capped at 15 minutes. That cap applies only to the delay this package calculates: a provider supplied `Retry-After` is treated as a minimum waiting period and is never shortened. A rate-limited result waits at least 60 seconds, per FCM's guidance for 429. Treating an unrecognised Firebase error code as retryable is our own conservative policy rather than documented Firebase guidance — Firebase documents retry behaviour by HTTP status class — and it is bounded by the dispatch retry budget. A retryable outcome can never revoke a registration.

Only an error FCM attributes to the registration itself disables one. Payload errors, configuration errors, quota errors and outages never do. `SENDER_ID_MISMATCH` in particular is treated as a configuration failure even though it describes a token this project cannot send to, because a deployment pointed at the wrong Firebase project returns it for an entire healthy fleet.

## Scope

`appScope` is an opaque provider namespace stored alongside every registration. The Firebase project ID is the normal value. It is part of both unique indexes and of every lookup, so changing it makes existing registrations invisible.

## Consumer-owned schema

Consumers register `PushInstallation` in both runtime and migration datasource metadata and create this PostgreSQL contract in a migration. The names are explicit and remain camel-case under any TypeORM naming strategy.

```sql
CREATE TYPE push_installation_platform_enum AS ENUM ('android', 'ios', 'web');
CREATE TABLE push_installation (
  uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt" timestamp(3) NOT NULL DEFAULT now(),
  "installationId" uuid NOT NULL,
  "installationSecretHash" varchar(64) NOT NULL,
  "userUuid" uuid NULL,
  "appScope" varchar NOT NULL,
  token varchar NOT NULL,
  "tokenHash" varchar(64) NOT NULL,
  platform push_installation_platform_enum NOT NULL,
  "appVersion" varchar NULL,
  "tokenGeneration" integer NOT NULL DEFAULT 1,
  "lastSeenAt" timestamp(3) NULL,
  "revokedAt" timestamp(3) NULL,
  "revokedReason" varchar NULL
);
CREATE UNIQUE INDEX "UQ_push_installation_app_installation"
  ON push_installation ("appScope", "installationId");
CREATE UNIQUE INDEX "UQ_push_installation_app_token"
  ON push_installation ("appScope", "tokenHash") WHERE "revokedAt" IS NULL;
CREATE INDEX "IDX_push_installation_user_active"
  ON push_installation ("userUuid")
  WHERE "revokedAt" IS NULL AND "userUuid" IS NOT NULL;
```

An application may add a foreign key from `"userUuid"` to its own user table and owns the deletion policy; it must be nullable, because a logged-out installation has no user. Raw tokens and raw installation secrets must never be logged or returned. Invalid-token revocation must include the generation that was sent.

The package requires TypeORM 1.x, matching `@wisemen/nestjs-typeorm`.

### Upgrading an existing schema

If you already created the table under the previous model, apply this. There is no in-package migration framework — the schema is yours.

```sql
ALTER TABLE push_installation ALTER COLUMN "userUuid" DROP NOT NULL;
ALTER TABLE push_installation ADD COLUMN "installationSecretHash" varchar(64);

-- Existing rows predate installation secrets and cannot be backfilled: a legitimate secret has
-- to originate on the client, and the server only ever holds a hash of one it was sent. Clearing
-- them costs nothing — every client re-registers on its next launch, and until then those
-- devices simply receive no pushes. No foreign key points at this table, so the delete is local:
-- push_dispatch_target keeps its historical rows.
DELETE FROM push_installation;

ALTER TABLE push_installation ALTER COLUMN "installationSecretHash" SET NOT NULL;

DROP INDEX "IDX_push_installation_user_active";
CREATE INDEX "IDX_push_installation_user_active"
  ON push_installation ("userUuid")
  WHERE "revokedAt" IS NULL AND "userUuid" IS NOT NULL;
```

The `DELETE` also disposes of rows revoked with a `'user_logged_out'` reason, which no longer exists as a concept: logging out detaches the user and leaves the registration valid.

## Installation lifecycle

Three lifetimes run independently and must not be conflated.

| Field | Meaning |
| --- | --- |
| `installationId` | Client-generated stable identity for this app installation. Survives logins, logouts and token rotations. |
| `installationSecret` | Client-generated high-entropy secret, created once with the `installationId` and stored securely on the device. Presented on every registration to prove the caller holds this installation. Only its SHA-256 is stored server-side, in a column that is never selected by default. |
| `token` | Current FCM registration token. A delivery address only; it may rotate at any time. |
| `tokenGeneration` | Version of the current token, used to stop a stale provider result from invalidating a newer one. Changes only when the token changes or a revoked installation re-registers — **never** because the user changed. |
| `userUuid` | The authenticated user currently associated with the installation. Nullable: an installation with no user is a valid registration that is nobody's send target. |

```text
app install         installationId = X, installationSecret = S generated once on device
user A logs in      upsertOne(X, S, token T1, user A)      → X.userUuid = A
token refreshes     upsertOne(X, S, token T2, user A)      → tokenGeneration++, X stays A
user A logs out     detachUserForOwner(X, A)               → X.userUuid = null, X still valid
user B logs in      upsertOne(X, S, token T3, user B)      → X.userUuid = B, same row
FCM: UNREGISTERED   revokeOneIfGenerationMatches(...)      → X.revokedAt set
```

### Detach is not revocation

`detachUserForOwner` is logout: it clears `userUuid` and nothing else. The registration stays valid and keeps its token, and the installation stops appearing in user-targeted sends because `"userUuid" = ANY(...)` is never true for null.

`revokeOneForOwner` is permanent device removal, and `revokeOneIfGenerationMatches` is what a confirmed recipient error triggers. Both set `revokedAt`, which means *this registration is no longer a valid delivery address*. Never use them for a logout.

### Why a separate installation secret

Associating an installation with a user has to be authorised by something. Neither available identifier is sufficient on its own:

- `installationId` is generated by the client and travels in plaintext. It is not secret and proves nothing.
- The FCM token is a delivery address that rotates, and can rotate while nobody is logged in — so requiring it as proof would lock the next user out of their own device.

The installation secret is dedicated to this one job. It never addresses anything and never rotates. This is **our architecture**, not something Firebase prescribes.

### Handling the installation secret

The raw secret is a long-lived bearer credential: anyone holding it can associate that installation with their own account. Treat it like one.

| | |
| --- | --- |
| Generated | On the client, from a CSPRNG, at least 256 bits, once per app install |
| Stored on the device | In secure storage — Keychain, EncryptedSharedPreferences or equivalent |
| Transmitted | Only as part of the authenticated registration call, only over TLS |
| Logged | Never — not by the client, the API layer, or this package |
| Stored server-side | Only as a SHA-256 hash, in `installationSecretHash` |
| In plaintext server-side | Never persisted; the raw value exists only in memory for the duration of the registration request, where it is hashed or compared and then discarded |

Server-side the raw value is touched in exactly two places: a constant-time comparison against the stored hash, and the hash computed on first registration. It is never written to a column, never logged — the installation code has no logger at all — and never interpolated into an error message; conflict errors carry fixed reason codes that reveal nothing about the other party.

`installationSecretHash` is declared `select: false`, so it is not loaded by any ordinary read and cannot be exposed by serializing an entity. The comparison helper fails closed if the hash is absent or malformed.

A plain SHA-256 is deliberate and correct here: the secret is uniformly random with at least 256 bits of entropy, so there is no guessable keyspace for a slow KDF to defend. Do not substitute bcrypt, Argon2 or PBKDF2 — they exist to protect low-entropy human passwords and would only add latency to every registration.

Your registration DTO must keep the secret out of request logging, validation error echoes, and any debug serialization.

An authenticated user may therefore take over an installation — that is an account switch — but only by proving possession of it. A remote caller who learns an `installationId` cannot. A lost logout is recoverable rather than terminal: the next user presents the same secret and the installation moves to them without any prior detach.

The secret never rotates and is never rewritten after creation. A client that loses it must generate a new `installationId` and secret, which registers as a fresh installation; the old row ages out when its token is next reported unregistered.

## Delivery guarantees

Provider submission is at-least-once. Provider calls happen outside the database transaction, so an acceptance followed by a crash before it is persisted can be submitted again on the next attempt:

```text
FCM accepts the message
→ the process crashes before the acceptance is persisted
→ the next attempt may submit the same message again
```

FCM itself does not guarantee that an accepted message reaches the device: messages are dropped for long-inactive devices, when too many non-collapsible messages are pending, and on TTL expiry.

`accepted` means the provider accepted or enqueued the message for delivery — Firebase's own definition, covering a message handed to APNs. It does not mean the device received it, that the operating system displayed it, or that anyone saw it.

Neither this package nor `@wisemen/nestjs-push-dispatch` adds anything to `PushMessage.data`. `PushDispatch.eventId` is available to the consumer, and the consumer's `render()` implementation should put it into the data payload when client-side deduplication is wanted.

## Account-switch privacy

A message already accepted by FCM cannot be recalled, and acceptance is not atomic with logout. A send that resolved its targets while installation X belonged to user A can therefore be delivered after user B has logged in on that same installation — the token is unchanged by design, so it reaches the same device.

The client contract that limits this:

1. The backend atomically detaches the user on logout (`detachUserForOwner`), so no *future* send resolves that installation for the previous user.
2. The client invalidates its FCM registration token on logout or account switch, so a message already in flight to the old token is rejected rather than displayed.
3. The client clears user-specific notifications it has already displayed.
4. On the next login the client obtains its current token and registers `installationId` + `installationSecret` + `token`.
5. The backend verifies possession and associates the installation with the new user.
6. If the token changed, `tokenGeneration` increments as usual.

Token rotation here is a **privacy policy for account switching**. It is not the definition of logout, and it is not what identifies the installation — the installation is stable across it.

### Limitation: visible notifications

This adapter sends visible notifications, so Android and iOS may display the `title` and `body` before any application code runs. **A recipient field in `data` therefore cannot prevent the wrong user from seeing a notification**, because there is no opportunity to filter before display. Do not rely on client-side recipient filtering to close this race.

The available mitigation is to limit what is exposed: when a visible notification can survive an account switch, keep `title` and `body` non-sensitive —

```text
"You have a new message"
"You have a new notification"
```

— and fetch the actual content from the authenticated API once the app is opened. This limits the information exposed; it is not a cryptographic guarantee.

If your product requires sensitive personalised notification bodies **with** a strict guarantee that the current authenticated user is checked before anything is displayed, the current visible-notification-only FCM adapter cannot provide that. That needs client-controlled display — a data-message architecture — which this adapter does not support.
