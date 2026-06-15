---
"@wisemen/coordinates": minor
---

rename `CoordinatesCommand.toCoordinates()` and `CoordinatesQuery.toCoordinates()` to
`parse()`, add `CoordinatesResponse.from(...)` for nullable response mapping, and
update the coordinates skill example to use the new API.

Migration: replace `dto.toCoordinates()` and `query.toCoordinates()` with
`dto.parse()` and `query.parse()`.
