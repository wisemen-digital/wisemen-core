import { ViesMaximumConcurrentRequestResponse } from '../responses/maximum-concurrent-request.response.js'

export const VIES_BASE_URL = 'https://ec.europa.eu/taxation_customs/vies/rest-api/'
export const VIES_ENDPOINTS = {
  HEALTH: 'check-status',
  CHECK_VAT_NUMBER: 'check-vat-number'
}

export const VIES_MAXIMUM_CONCURRENT_FIELD = 'actionSucceed' satisfies keyof ViesMaximumConcurrentRequestResponse