import type { TypedFlatConfigItem } from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'

type Awaitable<T> = Promise<T> | T

export type LintConfig = Awaitable<
  FlatConfigComposer<any, any>
  | Linter.Config[]
  | TypedFlatConfigItem
  | TypedFlatConfigItem[]
> & { languageOptions?: { parser?: any } }
