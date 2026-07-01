import type { TranslationAccess, TranslationAccessArgs } from '#types.ts'

export async function canAccessTranslation(
  access: TranslationAccess | undefined,
  args: TranslationAccessArgs,
): Promise<boolean> {
  if (!access) {
    return true
  }

  return Boolean(await access(args))
}
