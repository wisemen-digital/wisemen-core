---
"@wisemen/nestjs-jwt-verifier": minor
---

**Breaking:** rename `JwtVerifierModule.forRoot` to `register` and
`forRootAsync` to `registerAsync`. The module registers one named verifier per
call rather than a single global instance, so `register` describes it more
accurately. Update call sites; the old names are removed.

Also add `createJwtVerifier` and `decodeJwtPayload` for resolving a verifier at
runtime instead of registering it as a static provider.
