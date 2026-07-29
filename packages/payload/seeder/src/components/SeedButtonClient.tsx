'use client'

import {
  toast,
  useConfig,
} from '@payloadcms/ui'
import type React from 'react'
import {
  useCallback,
  useState,
} from 'react'

import { isRecord } from '#_kit'
import type { SeedButtonProps } from '#types'

export type { SeedButtonProps }

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now
    {' '}
    <a target="_blank" href="/" rel="noreferrer">
      visit your website
    </a>
  </div>
)

const MAX_SHOWN_ISSUES = 5

function summarizeIssues(issues: string[]): string {
  const shown = issues.slice(0, MAX_SHOWN_ISSUES)
  const more = issues.length - shown.length

  return shown.join('\n') + (more > 0 ? `\n…and ${more} more` : '')
}

export const SeedButtonClient: React.FC<SeedButtonProps> = ({
  endpoint,
}) => {
  const {
    config,
  } = useConfig()
  const [
    seeded,
    setSeeded,
  ] = useState(false)
  const [
    failed,
    setFailed,
  ] = useState(false)
  const [
    loading,
    setLoading,
  ] = useState(false)
  const [
    confirming,
    setConfirming,
  ] = useState(false)
  const url = endpoint ?? `${config.serverURL ?? ''}${config.routes.api}/seed`

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (loading) {
        return toast.info('Seeding already in progress.')
      }
      if (!confirming) {
        return setConfirming(true)
      }

      setConfirming(false)
      setFailed(false)
      setLoading(true)

      const run = fetch(url, {
        credentials: 'include',
        method: 'POST',
      })
        .then(async (res) => {
          const raw: unknown = await res.json().catch(() => ({}))
          const error = isRecord(raw) && typeof raw.error === 'string' ? raw.error : undefined
          const issues = isRecord(raw) && Array.isArray(raw.issues) ? raw.issues.filter((i): i is string => typeof i === 'string') : undefined
          const message = isRecord(raw) && typeof raw.message === 'string' ? raw.message : undefined

          if (!res.ok) {
            const base = error ?? 'An error occurred while seeding.'

            throw new Error(issues?.length ? `${base}\n${summarizeIssues(issues)}` : base)
          }

          setSeeded(true)

          return {
            message,
          }
        })
        .catch((error) => {
          setFailed(true)

          throw error instanceof Error ? error : new Error(String(error))
        })
        .finally(() => setLoading(false))

      toast.promise(run, {
        error: (err) => (err instanceof Error ? err.message : 'An error occurred while seeding.'),
        loading: 'Seeding with data....',
        success: (body) => body.message ?? <SuccessMessage />,
      })
    },
    [
      loading,
      confirming,
      url,
    ],
  )

  let message = ''

  if (seeded) {
    message = ' (done — click to reseed)'
  }
  if (failed) {
    message = ' (failed — click to retry)'
  }
  if (confirming) {
    message = ' — click again to confirm: this wipes seeded collections'
  }
  if (loading) {
    message = ' (seeding...)'
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading}>
      Seed your database
      {message}
    </button>
  )
}

export default SeedButtonClient
