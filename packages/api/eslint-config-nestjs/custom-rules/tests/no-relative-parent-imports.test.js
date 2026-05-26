/* oxlint-disable custom-rules/no-relative-import, custom-rules/no-relative-parent-imports */
import { describe, it } from 'node:test'
import { join } from 'path'
import { RuleTester } from 'eslint'

import { rules } from '../no-relative-parent-imports.js'

// Use a filename one level up from the custom-rules folder so paths resolve relative to
// the package root (packages/api/eslint-config-nestjs/) – which is where package.json lives.
const FAKE_FILE = join(import.meta.dirname, '../../src/modules/users/use-cases/get-user.ts')

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

// ---------------------------------------------------------------------------
// no-relative-parent-imports
// ---------------------------------------------------------------------------
describe('no-relative-parent-imports rule', () => {
  describe('valid', () => {
    it('allows absolute (non-relative) imports', () => {
      ruleTester.run('no-relative-parent-imports', rules['no-relative-parent-imports'], {
        valid: [
          {
            code: `import { foo } from '@/some/module'`,
            filename: FAKE_FILE,
          },
          {
            code: `import { foo } from 'some-package'`,
            filename: FAKE_FILE,
          },
        ],
        invalid: [],
      })
    })

    it('allows same-directory relative imports', () => {
      ruleTester.run('no-relative-parent-imports', rules['no-relative-parent-imports'], {
        valid: [
          {
            code: `import { foo } from './sibling'`,
            filename: FAKE_FILE,
          },
          {
            code: `import { foo } from './nested/module'`,
            filename: FAKE_FILE,
          },
        ],
        invalid: [],
      })
    })
  })

  describe('invalid', () => {
    it('reports a parent-directory import (../)', () => {
      ruleTester.run('no-relative-parent-imports', rules['no-relative-parent-imports'], {
        valid: [],
        invalid: [
          {
            code: `import { foo } from '../other-module'`,
            filename: FAKE_FILE,
            output: `import { foo } from 'src/modules/users/other-module'`,
            errors: [
              { message: /Relative imports from parent directories are not allowed/ },
            ],
          },
        ],
      })
    })

    it('reports a deeply-nested parent-directory import (../../)', () => {
      ruleTester.run('no-relative-parent-imports', rules['no-relative-parent-imports'], {
        valid: [],
        invalid: [
          {
            code: `import { bar } from '../../another-module'`,
            filename: FAKE_FILE,
            output: `import { bar } from 'src/modules/another-module'`,
            errors: [
              { message: /Relative imports from parent directories are not allowed/ },
            ],
          },
        ],
      })
    })
  })
})

// ---------------------------------------------------------------------------
// no-relative-import
// ---------------------------------------------------------------------------
describe('no-relative-import rule', () => {
  describe('valid', () => {
    it('allows absolute (non-relative) imports', () => {
      ruleTester.run('no-relative-import', rules['no-relative-import'], {
        valid: [
          {
            code: `import { foo } from '@/some/module'`,
            filename: FAKE_FILE,
          },
          {
            code: `import { foo } from 'some-package'`,
            filename: FAKE_FILE,
          },
        ],
        invalid: [],
      })
    })
  })

  describe('invalid', () => {
    it('reports a same-directory relative import (./ )', () => {
      ruleTester.run('no-relative-import', rules['no-relative-import'], {
        valid: [],
        invalid: [
          {
            code: `import { foo } from './sibling'`,
            filename: FAKE_FILE,
            output: `import { foo } from 'src/modules/users/use-cases/sibling'`,
            errors: [
              { message: /Relative imports are not allowed/ },
            ],
          },
        ],
      })
    })

    it('reports a parent-directory relative import (../)', () => {
      ruleTester.run('no-relative-import', rules['no-relative-import'], {
        valid: [],
        invalid: [
          {
            code: `import { foo } from '../other-module'`,
            filename: FAKE_FILE,
            output: `import { foo } from 'src/modules/users/other-module'`,
            errors: [
              { message: /Relative imports are not allowed/ },
            ],
          },
        ],
      })
    })
  })
})
