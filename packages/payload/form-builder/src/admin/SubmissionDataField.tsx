'use client'

import { useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import React from 'react'

import type { SubmissionValue } from '#types.ts'

function displayValue(value: SubmissionValue['value']): string {
  if (value === null || value === undefined || value === '') { return '—' }
  if (value === true) { return 'Yes' }
  if (value === false) { return 'No' }

  return Array.isArray(value) ? value.join(', ') : String(value)
}

/** Payload admin field: presents the submission as labelled answers, never raw JSON. */
export function SubmissionDataField({
  path,
}: JSONFieldClientProps) {
  const {
    value,
  } = useField<SubmissionValue[]>({
    potentiallyStalePath: path,
  })
  const values = Array.isArray(value) ? value : []

  return (
    <section style={{
      marginBlock: '1rem',
    }}
    >
      <h3 style={{
        marginBottom: '0.75rem',
      }}
      >
        Answers
      </h3>
      {values.length === 0
        ? <p>No answers were recorded.</p>
        : (
            <dl style={{
              display: 'grid',
              gap: '0.75rem',
              gridTemplateColumns: 'minmax(10rem, 1fr) minmax(0, 3fr)',
              margin: 0,
            }}
            >
              {values.map((entry) => (
                <React.Fragment key={entry.name}>
                  <dt style={{
                    color: 'var(--theme-elevation-600)',
                    fontWeight: 600,
                  }}
                  >
                    {entry.label}
                  </dt>
                  <dd style={{
                    margin: 0,
                    overflowWrap: 'anywhere',
                    whiteSpace: 'pre-wrap',
                  }}
                  >
                    {displayValue(entry.value)}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          )}
    </section>
  )
}
