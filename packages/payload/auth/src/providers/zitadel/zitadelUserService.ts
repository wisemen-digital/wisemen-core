import type { AuthEnv } from '#shared/payloadAuth.types.ts'

export interface ZitadelProfile {
  displayName?: string
  familyName: string
  givenName: string
}

export interface CreateZitadelHumanUserParams {
  organizationId?: string
  email: string
  password?: string
  profile: ZitadelProfile
  /**
   * This template is rendered by ZITADEL. Supported placeholders are
   * `{{.UserID}}`, `{{.OrgID}}`, and `{{.Code}}`.
   */
  verificationUrlTemplate?: string
}

export interface CreateZitadelHumanUserResult {
  id: string
  emailCode?: string
  phoneCode?: string
}

export interface SetZitadelPasswordParams {
  changeRequired?: boolean
  password: string
}

export interface VerifyZitadelEmailAndSetPasswordParams extends SetZitadelPasswordParams {
  userId: string
  code: string
}

export interface VerifyZitadelInviteCodeAndSetPasswordParams extends SetZitadelPasswordParams {
  userId: string
  code: string
}

interface ZitadelErrorBody {
  message?: string
}

const TRAILING_SLASH_REGEX = /\/$/u

function baseUrl(url: string): string {
  return url.replace(TRAILING_SLASH_REGEX, '')
}

async function throwForResponse(response: Response, action: string): Promise<void> {
  if (response.ok) {
    return
  }

  const body = await response.json().catch(() => {}) as ZitadelErrorBody | undefined

  throw new Error(`${action} failed (${response.status}): ${body?.message ?? response.statusText}`)
}

/**
 * Server-only wrapper around the ZITADEL User v2 REST API.
 * Do not expose the service-user token to a browser.
 */
export function createZitadelUserService(env: Pick<AuthEnv, 'authBaseUrl' | 'authOrganizationId' | 'authServiceUser'>) {
  async function request<T>(path: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${baseUrl(env.authBaseUrl)}${path}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${env.authServiceUser}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    await throwForResponse(response, `ZITADEL ${options.method ?? 'GET'} ${path}`)

    return response.json() as Promise<T>
  }

  return {
    async createHumanUser(params: CreateZitadelHumanUserParams): Promise<CreateZitadelHumanUserResult> {
      const response = await request<{ id?: string
        userId?: string
        emailCode?: string
        phoneCode?: string }>('/v2/users/new', {
        body: JSON.stringify({
          human: {
            organizationId: params.organizationId ?? env.authOrganizationId,
            email: {
              email: params.email,
              sendCode: params.verificationUrlTemplate == null
                ? {}
                : {
                    urlTemplate: params.verificationUrlTemplate,
                  },
            },
            password: params.password == null
              ? undefined
              : {
                  password: params.password,
                },
            profile: params.profile,
          },
        }),
        method: 'POST',
      })

      const id = response.id ?? response.userId

      if (id == null) {
        throw new Error('ZITADEL create user response did not include an id')
      }

      return {
        id,
        emailCode: response.emailCode,
        phoneCode: response.phoneCode,
      }
    },

    async setPassword(userId: string, params: SetZitadelPasswordParams): Promise<void> {
      await request(`/v2/users/${encodeURIComponent(userId)}`, {
        body: JSON.stringify({
          human: {
            password: {
              changeRequired: params.changeRequired ?? false,
              password: params.password,
            },
          },
        }),
        method: 'PATCH',
      })
    },

    async verifyEmail(userId: string, code: string): Promise<void> {
      await request(`/v2/users/${encodeURIComponent(userId)}/email/verify`, {
        body: JSON.stringify({
          verificationCode: code,
        }),
        method: 'POST',
      })
    },

    async verifyEmailAndSetPassword({
      userId,
      code,
      ...password
    }: VerifyZitadelEmailAndSetPasswordParams): Promise<void> {
      await this.verifyEmail(userId, code)
      await this.setPassword(userId, password)
    },

    async verifyInviteCode(userId: string, code: string): Promise<void> {
      await request(`/v2/users/${encodeURIComponent(userId)}/invite_code/verify`, {
        body: JSON.stringify({
          verificationCode: code,
        }),
        method: 'POST',
      })
    },

    async verifyInviteCodeAndSetPassword({
      userId,
      code,
      ...password
    }: VerifyZitadelInviteCodeAndSetPasswordParams): Promise<void> {
      await this.verifyInviteCode(userId, code)
      await this.setPassword(userId, password)
    },
  }
}
