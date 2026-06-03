---
"@wisemen/api-error": major
---

feat(TBN-1187):
replace http status specific error response decorators with `@ApiErrorResponse` which catches all status types automatically.

migration guide:
replace the following with `ApiErrorResponse`:

- ApiNotFoundErrorResponse
- ApiBadRequestErrorResponse
- ApiConflictErrorResponse
