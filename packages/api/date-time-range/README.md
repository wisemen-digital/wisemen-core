# Database prerequisites

A custom postgres type needs to be created for the `DateTimeRange` extension of `Typeorm` to work.
Please add the following query to a migration:

```sql
 DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'tstzrange3'
        AND n.nspname = 'public'  -- change if not public schema
    ) THEN
        CREATE TYPE tstzrange3 AS RANGE (
        subtype = timestamp (3) with time zone,
        multirange_type_name = tstzmultirange3
        );
    END IF;
END $$;
```

