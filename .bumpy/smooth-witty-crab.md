---
"@wisemen/nestjs-custom-fields": patch
---

Fix column options of @CustomFieldValueColumn() to allow null. 
Extend CustomFieldDefinitionsRepository method to insert an array of entity types to avoid multiple database roundtrips.
Add a customFieldValue() factory for tests.
Update SKILL.MD with changes.
