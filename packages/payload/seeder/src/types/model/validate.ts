import type { BuiltModel } from './model'

export interface ValidateArgs {
  collectionSlugs: Set<string>
  fieldNames?: Map<string, Set<string>>
  fileCollections: Set<string>
  globalSlugs: Set<string>
  model: BuiltModel
}
