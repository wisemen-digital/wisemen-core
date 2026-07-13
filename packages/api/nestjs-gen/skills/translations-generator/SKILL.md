---
name: translations-generator
description: Use when syncing permission, notification, or event-log translation JSON files with the project's enums using @wisemen/ngen.
---

# @wisemen/ngen - Translations Generator

Run `pnpx @wisemen/ngen` and pick **`translations`**. It doesn't template
new code — it rebuilds a per-language translation JSON file from a source
enum in the target project, preserving any already-translated strings and
adding placeholders for new keys.

Requires the target project to already have
`src/modules/localization/resources/<lang>/` folders for at least one
language — the language checkbox reads its choices from that directory's
subfolder names. If the base `resources` folder is missing, the command
throws; if it has no language subfolders, the checkbox has zero choices.

## Prompts

1. `For what would you like to generate translations?` — list, default
   `Permissions`: `Permissions`, `Notifications`, or `Event logs`.
2. `Select the languages...` — checkbox, choices = subfolder names under
   `src/modules/localization/resources/`, all pre-checked.

## What each type does

| Type | Target file | Source enum | Leaf fields |
| --- | --- | --- | --- |
| Permissions | `<lang>/permissions.json` | `Permission` (`src/**/permission.enum.ts`) | `group-name`, `name`, `description` |
| Notifications | `<lang>/notifications.json` | `NotificationType` (`src/**/notification/enums/notification-types.enum.ts`) | `group-name`, `group-description`, `content`, `description` |
| Event logs | `<lang>/event-log.json` (singular filename, despite the `eventLogs` prompt value) | `DomainEventType` (`src/**/domain-event-type.ts`), plus every `src/**/*.event.ts` scanned for `@RegisterDomainEvent(DomainEventType.X, version)` | `v<version>` per registered version |

In all three cases, the enum's string value is dot-notation
(`'group.subgroup.leaf'`) and drives nested JSON keys — each segment becomes
a nested object, only the leaf gets content fields.

## Merge behavior

The JSON tree is rebuilt fresh from the enum every run:

- Keys that still exist in the enum keep their previously translated value.
- Keys new to the enum get an empty-string placeholder (or, for event-log
  versions, the enum's literal string as a placeholder).
- Keys no longer present in the enum are dropped — the file is fully
  overwritten (`JSON.stringify(..., '\t')`), not patched.

This makes it safe to re-run after adding/renaming/removing enum members:
diff the result and fill in placeholder (`""`) strings for new keys.

## Gotchas

- If the source enum file can't be resolved by glob, the command throws
  (`Permission enum not found`, etc.) — create the enum first.
- Renaming an enum member's dotted value effectively creates a new key and
  silently drops the old translated one; move the translated string over by
  hand if you want to keep it after a rename.
- The `eventLogs` type writes to `event-log.json` (singular) — don't go
  looking for `event-logs.json`.
