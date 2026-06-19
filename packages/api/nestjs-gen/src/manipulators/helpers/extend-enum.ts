import { SourceFile } from 'ts-morph'

export function extendEnum (
  targetFile: SourceFile,
  enumName: string,
  newMembers: Record<string, string>
): void {
  const targetEnum = targetFile.getEnum(enumName)

  if (!targetEnum) throw new Error(`Enum ${enumName} not found`)

  for (const [name, value] of Object.entries(newMembers)) {
    if (targetEnum.getMember(name)) {
      continue
    }

    const members = targetEnum.getMembers()
    const insertIndex = members.findIndex(m => m.getName().localeCompare(name) > 0)

    targetEnum.insertMembers(
      insertIndex === -1 ? members.length : insertIndex,
      [
        {
          name,
          initializer: `'${value}'`
        }
      ]
    )
  }
}
