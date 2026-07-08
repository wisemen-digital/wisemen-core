'use client'

import { LoadingOverlay } from '@payloadcms/ui'
import { getCookie } from 'cookies-next'
import {
  redirect,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { useEffect } from 'react'

import { loginWithCode } from '#client/loginWithCode.ts'
import { CODE_VERIFIER_COOKIE_NAME } from '#shared/authData.ts'
import type { AuthProviderType } from '#shared/payloadAuth.types.ts'

interface CallbackViewProps {
  clientId: string
  organizationId: string
  authBaseUrl: string
  cmsBaseUrl: string
  provider: AuthProviderType
}

export function CallbackView({
  clientId,
  organizationId,
  authBaseUrl,
  cmsBaseUrl,
  provider,
}: CallbackViewProps) {
  const searchParams = useSearchParams()
  const code = searchParams?.get('code')
  const router = useRouter()

  if (code == null) {
    redirect('/login')
  }

  const codeVerifier = getCookie(CODE_VERIFIER_COOKIE_NAME) as string

  useEffect(() => {
    loginWithCode({
      clientId,
      organizationId,
      authBaseUrl,
      cmsBaseUrl,
      code,
      codeVerifier,
      provider,
    })
      .then(({
        success,
      }) => {
        if (success) {
          router.push('/')
          window.location.replace('/')
        }
      })
  }, [
    authBaseUrl,
    clientId,
    cmsBaseUrl,
    code,
    codeVerifier,
    organizationId,
    provider,
    router,
  ])

  return (
    <div style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      height: '100vh',
      justifyContent: 'center',
    }}
    >
      <LoadingOverlay />
    </div>
  )
}
