import { Injectable } from '@nestjs/common'
import { VIES_BASE_URL, VIES_ENDPOINTS, VIES_MAXIMUM_CONCURRENT_FIELD } from '../constants/vies-endpoint.constant.js'
import { ViesHealthResponse } from '../responses/health.response.js'
import { ViesCheckVatNumberCommand } from '../commands/check-vat-number.command.js'
import { ViesCheckVatNumberResponse } from '../responses/check-vat-number.response.js'
import { ViesMaximumConcurrentRequestResponse } from '../responses/maximum-concurrent-request.response.js'
import { ViesUnavailableError } from '../errors/vies-unavailable.error.js'
import { URL } from 'node:url'

type CheckVatNumberResponse = ViesCheckVatNumberResponse | ViesMaximumConcurrentRequestResponse

@Injectable()
export class ViesClient {
  async checkHealthStatus(): Promise<ViesHealthResponse> {
    const url = new URL(VIES_ENDPOINTS.HEALTH, VIES_BASE_URL)

    const response = await this.fetchVies(url)

    if (!response.ok) {
      throw new ViesUnavailableError()
    }

    return await response.json() as ViesHealthResponse
  }

  async checkVatNumber(
    command: ViesCheckVatNumberCommand
  ): Promise<ViesCheckVatNumberResponse> {
    const url = new URL(VIES_ENDPOINTS.CHECK_VAT_NUMBER, VIES_BASE_URL)

    const response = await this.fetchVies(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command)
    })

    if (!response.ok) {
      throw new ViesUnavailableError()
    }

    const vatNumberResponse = await response.json() as CheckVatNumberResponse

    if (VIES_MAXIMUM_CONCURRENT_FIELD in vatNumberResponse) {
      throw new ViesUnavailableError()
    }

    return vatNumberResponse
  }

  private async fetchVies(url: URL, init?: RequestInit): Promise<Response> {
    try {
      return await fetch(url, init)
    } catch {
      throw new ViesUnavailableError()
    }
  }
}
