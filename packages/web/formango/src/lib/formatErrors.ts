import type {
  ZodFormattedError,
  ZodIssue,
} from 'zod'

import type {
  FormattedError,
  StandardSchemaV1,
} from '@/types'

function issueMapper(issue: FormattedError<any> | StandardSchemaV1.Issue): string {
  return issue.message
}

function _isZodIssue(error: any): error is ZodIssue {
  return error.code !== undefined
}

type SomeIssues<TType> = FormattedError<TType>[] | readonly StandardSchemaV1.Issue[]
type SomeIssue<TType> = FormattedError<TType> | StandardSchemaV1.Issue

function getNormalizedPathArray<TType>(issue: SomeIssue<TType>): string[] {
  if (typeof issue.path === 'object') {
    return issue.path
      ?.map((item) => (typeof item === 'object' ? item.key : item)) as string[]
  }

  return issue.path as unknown as string[]
}

export function formatErrorsToZodFormattedError<TType>(issues: SomeIssues<TType>): ZodFormattedError<TType> {
  const fieldErrors: ZodFormattedError<TType> = {
    _errors: [],
  } as any

  function processIssue(issue: SomeIssue<TType>): any {
    // Issue without path gets added to the root
    if (issue.path == null || issue.path?.length === 0) {
      fieldErrors._errors.push(issueMapper(issue))

      return
    }

    // Issue with path gets added to the correct field

    const normalizedPath = getNormalizedPathArray(issue)

    let curr: any = fieldErrors
    let i = 0

    while (i < normalizedPath.length) {
      const el = normalizedPath[i]
      const terminal = i === normalizedPath.length - 1

      if (!terminal) {
        curr[el] = curr[el] || {
          _errors: [],
        }
      }
      else {
        curr[el] = curr[el] || {
          _errors: [],
        }
        curr[el]._errors.push(issueMapper(issue))
      }

      curr = curr[el]
      i++
    }
  }

  for (const issue of issues) {
    processIssue(issue)
  }

  return fieldErrors
}
