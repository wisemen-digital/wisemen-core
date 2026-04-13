import type { OAuth2Tokens } from '../apiClient'
import type { TokensStrategy } from './tokensStrategy.type'

export class LocalStorageTokensStrategy implements TokensStrategy {
  private readonly CODE_VERIFIER_KEY = 'code_verifier'
  private readonly TOKENS_KEY = 'tokens'

  constructor(private readonly prefix?: string) {}

  private getStorageKey(key: string): string {
    if (this.prefix === undefined || this.prefix === '') {
      return key
    }

    return `${this.prefix}:${key}`
  }

  public getCodeVerifier(): string | null {
    return localStorage.getItem(this.getStorageKey(this.CODE_VERIFIER_KEY))
  }

  public getTokens(): OAuth2Tokens | null {
    const tokens = localStorage.getItem(this.getStorageKey(this.TOKENS_KEY))

    if (tokens === null) {
      return null
    }

    return JSON.parse(tokens as string) as OAuth2Tokens
  }

  public removeCodeVerifier(): void {
    localStorage.removeItem(this.getStorageKey(this.CODE_VERIFIER_KEY))
  }

  public removeTokens(): void {
    localStorage.removeItem(this.getStorageKey(this.TOKENS_KEY))
  }

  public setCodeVerifier(codeVerifier: string): void {
    localStorage.setItem(this.getStorageKey(this.CODE_VERIFIER_KEY), codeVerifier)
  }

  public setTokens(tokens: OAuth2Tokens): void {
    localStorage.setItem(this.getStorageKey(this.TOKENS_KEY), JSON.stringify(tokens))
  }
}
