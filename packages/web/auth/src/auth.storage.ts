interface AuthTransaction {
  createdAt: number
  providerKey: string
  redirectUrl: string
}

const AUTH_TRANSACTION_TTL_IN_MS = 15 * 60 * 1000

function createState(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    throw new Error('Secure random auth state generation is unavailable')
  }

  const bytes = new Uint8Array(16)

  globalThis.crypto.getRandomValues(bytes)

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage
}

function pruneTransactions(transactions: Record<string, AuthTransaction>): Record<string, AuthTransaction> {
  const now = Date.now()

  return Object.fromEntries(
    Object.entries(transactions).filter(([
      ,
      transaction,
    ]) => now - transaction.createdAt <= AUTH_TRANSACTION_TTL_IN_MS),
  )
}

export class AuthTransactionStore {
  constructor(private readonly storageKey: string) {}

  create(providerKey: string, redirectUrl: string): string {
    const state = createState()
    const transactions = pruneTransactions(this.read())

    transactions[state] = {
      createdAt: Date.now(),
      providerKey,
      redirectUrl,
    }

    this.write(transactions)

    return state
  }

  consume(state: string): AuthTransaction | null {
    const transactions = pruneTransactions(this.read())
    const transaction = transactions[state] ?? null

    delete transactions[state]
    this.write(transactions)

    return transaction
  }

  private read(): Record<string, AuthTransaction> {
    const storage = getSessionStorage()
    const serializedTransactions = storage?.getItem(this.storageKey) ?? null

    if (serializedTransactions === null) {
      return {}
    }

    try {
      return JSON.parse(serializedTransactions) as Record<string, AuthTransaction>
    }
    catch {
      storage?.removeItem(this.storageKey)

      return {}
    }
  }

  private write(transactions: Record<string, AuthTransaction>): void {
    const storage = getSessionStorage()

    if (storage === null) {
      return
    }

    if (Object.keys(transactions).length === 0) {
      storage.removeItem(this.storageKey)

      return
    }

    storage.setItem(this.storageKey, JSON.stringify(transactions))
  }
}

export class AuthSessionEventStore {
  constructor(private readonly storageKey: string) {}

  broadcastSessionCleared(): void {
    const storage = getLocalStorage()

    if (storage === null) {
      return
    }

    storage.setItem(this.storageKey, `${Date.now()}`)
    storage.removeItem(this.storageKey)
  }

  listen(onSessionCleared: () => void): () => void {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const handleStorage = (event: StorageEvent): void => {
      if (event.key === this.storageKey && event.newValue !== null) {
        onSessionCleared()
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }
}
