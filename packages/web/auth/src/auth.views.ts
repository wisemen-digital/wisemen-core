import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
} from 'vue'
import {
  useRoute,
  useRouter,
} from 'vue-router'

import type { AuthRouteMeta } from './auth.internal'
import { useInternalAuth } from './auth.internal'

function AuthCard(
  title: string,
  description: string,
  children: Array<ReturnType<typeof h>>,
): ReturnType<typeof h> {
  return h('main', {
    style: {
      alignItems: 'center',
      background: '#f8fafc',
      color: '#0f172a',
      display: 'flex',
      fontFamily: 'system-ui, sans-serif',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1.5rem',
    },
  }, [
    h('section', {
      style: {
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '1rem',
        boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
        maxWidth: '28rem',
        padding: '2rem',
        width: '100%',
      },
    }, [
      h('h1', {
        style: {
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: '0 0 0.75rem',
        },
      }, title),
      h('p', {
        style: {
          color: '#475569',
          lineHeight: '1.5',
          margin: '0 0 1.5rem',
        },
      }, description),
      ...children,
    ]),
  ])
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown auth error'
}

export const DefaultAuthLoginView = defineComponent({
  name: 'DefaultAuthLoginView',
  setup() {
    const auth = useInternalAuth<unknown>()
    const route = useRoute()
    const routeMeta = computed(() => route.meta as AuthRouteMeta)
    const redirectUrl = computed(() => typeof route.query.redirectUrl === 'string' ? route.query.redirectUrl : undefined)
    const isStartingLogin = ref(false)
    const error = ref<string | null>(null)

    async function startLogin(providerKey?: string): Promise<void> {
      error.value = null
      isStartingLogin.value = true

      try {
        await auth.startLogin(providerKey, redirectUrl.value)
      }
      catch (authError) {
        error.value = getErrorMessage(authError)
        isStartingLogin.value = false
      }
    }

    onMounted(() => {
      if (routeMeta.value.authAutoStart === true) {
        void startLogin(routeMeta.value.authProviderKey)
      }
    })

    return () => {
      const providers = routeMeta.value.authProviderKey === undefined
        ? auth.providers
        : auth.providers.filter((provider) => provider.key === routeMeta.value.authProviderKey)

      const buttons = providers.map((provider) => h('button', {
        disabled: isStartingLogin.value,
        style: {
          background: '#0f172a',
          border: 'none',
          borderRadius: '0.75rem',
          color: '#ffffff',
          cursor: isStartingLogin.value ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          marginTop: '0.75rem',
          opacity: isStartingLogin.value ? '0.7' : '1',
          padding: '0.875rem 1rem',
          width: '100%',
        },
        type: 'button',
        onClick: () => {
          void startLogin(provider.key)
        },
      }, provider.label || auth.messages.signInLabel))

      if (error.value !== null) {
        buttons.push(h('p', {
          style: {
            color: '#dc2626',
            margin: '1rem 0 0',
          },
        }, error.value))
      }

      return AuthCard(auth.messages.loginTitle, auth.messages.loginDescription, buttons)
    }
  },
})

export const DefaultAuthCallbackView = defineComponent({
  name: 'DefaultAuthCallbackView',
  setup() {
    const auth = useInternalAuth<unknown>()
    const route = useRoute()
    const router = useRouter()

    onMounted(() => {
      const code = typeof route.query.code === 'string' ? route.query.code : null
      const state = typeof route.query.state === 'string' ? route.query.state : null

      void auth.completeLogin(code, state)
        .then((redirectUrl) => {
          window.location.replace(redirectUrl)
        })
        .catch(async () => {
          await router.replace(auth.getLoginRouteLocation())
        })
    })

    return () => AuthCard(
      auth.messages.callbackTitle,
      auth.messages.callbackDescription,
      [],
    )
  },
})

export const DefaultAuthLogoutView = defineComponent({
  name: 'DefaultAuthLogoutView',
  setup() {
    const auth = useInternalAuth<unknown>()

    onMounted(() => {
      void auth.logout()
    })

    return () => AuthCard(
      auth.messages.logoutTitle,
      auth.messages.logoutDescription,
      [],
    )
  },
})
