import type { LintConfig } from '@/types/lint.type.ts'

const customGrouping = {
  customGroups: [
    {
      elementNamePattern: '^(?:id)$|^(?:uuid.*)$',
      groupName: 'id',
    },
    {
      elementNamePattern: '^(.*Id|.*Uuid|.*_id|.*_uuid)$',
      groupName: 'relations',
    },
    {
      elementNamePattern: '^(?:title)$',
      groupName: 'title',
    },
    {
      elementNamePattern: '^start(?:Date|_date)$',
      groupName: 'dateStartDate',
    },
    {
      elementNamePattern: '^end(?:Date|_date)$',
      groupName: 'dateEndDate',
    },
    {
      elementNamePattern: '^start(?:Time|_time)$',
      groupName: 'dateStartTime',
    },
    {
      elementNamePattern: '^end(?:Time|_time)$',
      groupName: 'dateEndTime',
    },
    {
      elementNamePattern: '^started(?:On|At|_on|_at)$',
      groupName: 'dateStartedOn',
    },
    {
      elementNamePattern: '^ended(?:On|At|_on|_at)$',
      groupName: 'dateEndedOn',
    },
    {
      elementNamePattern: '^start.+(?:Date|_date)$',
      groupName: 'dateStartWithDate',
    },

    {
      elementNamePattern: '^end.+(?:Date|_date)$',
      groupName: 'dateEndWithDate',
    },
    {
      elementNamePattern: '^start.+(?:Time|_time)$',
      groupName: 'dateStartWithTime',
    },
    {
      elementNamePattern: '^end.+(?:Time|_time)$',
      groupName: 'dateEndWithTime',
    },

    {
      elementNamePattern: '^(.*At|.*On|.*_at|.*_on|.*_date|.*_time|.*Date|.*Time)$',
      groupName: 'date',
    },
    {
      elementNamePattern: '^(is.*|has.*)$',
      groupName: 'booleans',
    },
    {
      elementNamePattern: '^(?:name)$',
      groupName: 'name',
    },
    {
      elementNamePattern: 'unknown',
      groupName: 'unknown',
    },
    {
      elementNamePattern: '^(?:path)$',
      groupName: 'path',
    },
    {
      elementNamePattern: '^(?:component)$',
      groupName: 'component',
    },
    {
      elementNamePattern: '^(?:meta)$',
      groupName: 'meta',
    },
    {
      elementNamePattern: '^(?:redirect)$',
      groupName: 'redirect',
    },
    {
      elementNamePattern: '^(?:children)$',
      groupName: 'children',
    },
    {
      elementNamePattern: '^on.*$',
      groupName: 'event',
    },
  ],
  groups: [
    'id',
    'relations',
    'title',
    'dateStartDate',
    'dateEndDate',
    'dateStartTime',
    'dateEndTime',
    'dateStartedOn',
    'dateEndedOn',
    'dateStartWithDate',
    'dateEndWithDate',
    'dateStartWithTime',
    'dateEndWithTime',
    'date',
    'booleans',
    'name',
    'unknown',
    'path',
    'component',
    'meta',
    'redirect',
    'children',
    'event',
  ],

  ignoreCase: false,
  order: 'asc' as const,
  type: 'natural' as const,
}

export const perfectionistConfig: LintConfig = {
  name: 'perfectionist',
  rules: {
    'perfectionist/sort-classes': [
      'error',
      {
        groups: [
          'index-signature',
          'static-property',
          'private-property',
          'property',
          'constructor',
          'static-method',
          'private-method',
          'method',
        ],
        order: 'asc' as const,
        type: 'natural' as const,
      },
    ],
    'perfectionist/sort-enums': [
      'error',
      {
        order: 'asc' as const,
        type: 'natural' as const,
      },
    ],
    'perfectionist/sort-exports': 'off',
    'perfectionist/sort-imports': 'off',
    'perfectionist/sort-interfaces': [
      'error',
      {
        type: 'unsorted',
        useConfigurationIf: {
          declarationCommentMatchesPattern: {
            flags: 'i',
            pattern: '^do not sort$',
          },
        },
      },
      {
        ...customGrouping,
      },
    ],
    'perfectionist/sort-named-imports': 'off',
    'perfectionist/sort-object-types': [
      'error',
      {
        type: 'unsorted',
        useConfigurationIf: {
          declarationCommentMatchesPattern: {
            flags: 'i',
            pattern: '^do not sort$',
          },
        },
      },
      {
        ...customGrouping,
      },
    ],
    'perfectionist/sort-objects': [
      'error',
      {
        type: 'unsorted',
        useConfigurationIf: {
          declarationCommentMatchesPattern: {
            flags: 'i',
            pattern: '^do not sort$',
          },
        },
      },
      {
        type: 'unsorted',
        useConfigurationIf: {
          declarationMatchesPattern: '^variants$',
        },
      },
      {
        ...customGrouping,
      },
    ],
    'perfectionist/sort-union-types': [
      'error',
      {
        groups: [
          'conditional',
          'function',
          'import',
          'intersection',
          'keyword',
          'literal',
          'named',
          'object',
          'operator',
          'tuple',
          'union',
          'nullish',
          'unknown',
        ],
        ignoreCase: false,
        order: 'asc' as const,
        type: 'natural' as const,
      },
    ],
    'perfectionist/sort-vue-attributes': 'off',
  },
}
