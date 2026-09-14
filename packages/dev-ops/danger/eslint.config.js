import eslintNestJSConfig from '@wisemen/eslint-config-nestjs'

export default [
  ...eslintNestJSConfig,
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-floating-promises': 'off'
    }
  },
  {
    // These files are executed as raw TypeScript source by danger's on-the-fly
    // transpiler (single-file, no tsconfig `paths` rewriting), not just via the
    // compiled dist/ output - so they must use real relative imports rather
    // than the `lib/*` path alias, which only resolves for the normal tsc build.
    files: ['lib/rules/**/*.ts', '.github/actions/run-danger/dangerfile.ts'],
    rules: {
      'import-typescript/no-relative-parent-imports': 'off'
    }
  }
]
