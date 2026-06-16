---
"@wisemen/monetary": minor
---

monetary validator accept monetary class instance for min and max instead of number

Migration:
- Replace `minAmount` with `min` and `maxAmount` with `max` in `IsMonetary` validation.
- Use Monetary values instead of numbers. 
- Try to infer currency and precision from context.

E.g `@IsMonetary({ maxAmount: 10_00 })` becomes `@IsMonetary({ max: new Monetary(10_00, Currency.EUR, 2) })`.
