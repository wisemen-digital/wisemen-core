class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>()

  public clear(): void {
    this.store.clear()
  }

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  public key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  public get length(): number {
    return this.store.size
  }

  public removeItem(key: string): void {
    this.store.delete(key)
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value)
  }
}

const localStorage = new MemoryStorage()
const sessionStorage = new MemoryStorage()

Object.defineProperty(globalThis, 'window', {
  value: {
    addEventListener: () => {},
    localStorage,
    location: {
      origin: 'https://app.example.com',
      replace: () => {},
    },
    sessionStorage,
  },
  writable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorage,
  writable: true,
})

Object.defineProperty(globalThis, 'sessionStorage', {
  value: sessionStorage,
  writable: true,
})
