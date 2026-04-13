import stylistic from '@stylistic/eslint-plugin'

export default [
  stylistic.configs.customize({
    quotes: 'single',
    indent: 2,
    semi: false,
    jsx: false,
    braceStyle: '1tbs'
  }),
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/max-len': [
        'error',
        {
          code: 100,
          comments: 100,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreRegExpLiterals: true,
          ignoreTemplateLiterals: true
        }
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', next: 'return', prev: '*' },
        { blankLine: 'always', next: 'expression', prev: '*' },
        { blankLine: 'always', next: '*', prev: 'expression' },
        { blankLine: 'any', next: 'expression', prev: 'expression' },
        { blankLine: 'always', next: 'function', prev: '*' },
        { blankLine: 'always', next: '*', prev: 'function' },
        {
          blankLine: 'always', next: '*', prev: [
            'const',
            'let',
            'var'
          ]
        },
        {
          blankLine: 'any', next: [
            'const',
            'let',
            'var'
          ], prev: [
            'const',
            'let',
            'var'
          ]
        }
      ]
    // '@stylistic/indent': [
    //   'error',
    //   2,
    //   {
    //     ignoredNodes: [
    //       'FunctionExpression > .params[decorators.length > 0]',
    //       'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
    //       'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key'
    //     ]
    //   }
    // ]
    }
  }
]
