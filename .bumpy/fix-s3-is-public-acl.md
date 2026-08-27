---
"@wisemen/nestjs-file-storage": minor
---

Fix inverted `isPublic` check in the S3 provider's ACL resolution

`createTemporaryUploadUrl`, `upload` and `uploadStream` compared `isPublic === undefined`, so omitting the parameter uploaded objects as `public-read` while passing `isPublic: true` uploaded them as `private` — the exact opposite of the intent.

`isPublic` now defaults to `false` and is used directly: objects are only `public-read` when `isPublic: true` is passed, and `private` otherwise.

**Behaviour change:** uploads that relied on the previous (accidental) public default are now private. Pass `isPublic: true` where public objects are required.
