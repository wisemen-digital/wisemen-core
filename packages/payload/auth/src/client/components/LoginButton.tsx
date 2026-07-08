'use client'

import { getCookie } from 'cookies-next'
import { setCookie } from 'cookies-next/client'
import pkceChallenge from 'pkce-challenge'
import React, {
  useEffect,
  useState,
} from 'react'

import { getAuthClientStrategy } from '#providers/providerStrategy.ts'
import type { AuthClientConfig } from '#shared/authData.ts'
import {
  CODE_CHALLENGE_COOKIE_NAME,
  CODE_VERIFIER_COOKIE_NAME,
} from '#shared/authData.ts'

interface LoginButtonProps extends AuthClientConfig {
  label?: string
}

async function getLoginUrl({
  clientId,
  organizationId,
  authBaseUrl,
  cmsBaseUrl,
  provider,
}: LoginButtonProps): Promise<string> {
  const searchParams = new URLSearchParams()
  let codeChallenge = await getCookie(CODE_CHALLENGE_COOKIE_NAME)
  const codeVerifier = await getCookie(CODE_VERIFIER_COOKIE_NAME)

  if (codeChallenge == null || codeVerifier == null) {
    const codes = await pkceChallenge()

    setCookie(CODE_CHALLENGE_COOKIE_NAME, codes.code_challenge, {
      sameSite: 'lax',
      path: '/',
    })
    setCookie(CODE_VERIFIER_COOKIE_NAME, codes.code_verifier, {
      sameSite: 'lax',
      path: '/',
    })

    codeChallenge = codes.code_challenge
  }

  const strategy = getAuthClientStrategy(provider)

  return strategy.getLoginUrl({
    clientId,
    organizationId,
    authBaseUrl,
    cmsBaseUrl,
    codeChallenge: String(codeChallenge),
    searchParams,
  })
}

export function LoginButton({
  clientId,
  organizationId,
  authBaseUrl,
  cmsBaseUrl,
  label = 'Sign in',
  provider,
}: LoginButtonProps) {
  const [
    url,
    setUrl,
  ] = useState<string | null>(null)

  useEffect(() => {
    getLoginUrl({
      clientId,
      organizationId,
      authBaseUrl,
      cmsBaseUrl,
      label,
      provider,
    }).then((value) => {
      setUrl(value)
    })
  }, [
    authBaseUrl,
    clientId,
    cmsBaseUrl,
    label,
    organizationId,
    provider,
  ])

  return (
    <div>
      <a
        className={`
          btn btn--style-primary btn--icon-style-without-border btn--size-medium
        `}
        style={{
          display: 'block',
          textAlign: 'center',
          width: '100%',
        }}
        href={url ?? ''}
      >
        {label}
      </a>
    </div>
  )
}
