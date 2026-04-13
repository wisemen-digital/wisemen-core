import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { VIES_ENDPOINTS } from '../constants/vies-endpoint.constant.js'
import { ViesHealthResponse } from '../responses/health.response.js'
import { ViesCheckVatNumberCommand } from '../commands/check-vat-number.command.js'
import { ViesCheckVatNumberResponse } from '../responses/check-vat-number.response.js'
import { ViesMaximumConcurrentRequestResponse } from '../responses/maximum-concurrent-request.response.js'
import { ViesUnavailableError } from '../errors/vies-unavailable.error.js'

type CheckVatNumberResponse = ViesCheckVatNumberResponse | ViesMaximumConcurrentRequestResponse

@Injectable()
export class ViesClient {
  private readonly client: AxiosInstance

  constructor (
  ) {
    const baseUrl = 'https://ec.europa.eu/taxation_customs/vies/rest-api'

    this.client = axios.create({ baseURL: baseUrl })
  }

  async checkHealthStatus (): Promise<ViesHealthResponse> {
    const url = VIES_ENDPOINTS.HEALTH

    const response = await this.client.get<ViesHealthResponse>(url)

    return response.data
  }

  async checkVatNumber (
    command: ViesCheckVatNumberCommand
  ): Promise<ViesCheckVatNumberResponse> {
    const url = VIES_ENDPOINTS.CHECK_VAT_NUMBER

    const response = await this.client.post<CheckVatNumberResponse>(url, command)

    if ('actionSucceed' in response.data) {
      throw new ViesUnavailableError('Vies temporary unavailable')
    }

    return response.data
  }
}
