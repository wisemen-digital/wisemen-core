export interface OtelAuth  {
  type: string | undefined
  key: string | undefined
}


export function createOtelHeaders (config?: OtelAuth): Record<string, string> {
  const headers: Record<string,string> = { 'content-type': 'application/json' }

  if(config?.key === undefined) {
    return headers
  }

  if(config.type === 'basic') {
     headers.Authorization = `Basic ${config.key}` 
  } else {
     headers['signoz-access-token'] = config.key
  }

  return headers
}
