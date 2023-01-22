type HttpMethod = 'GET' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const makeRequest = async <T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  bodyRequest: Record<string, any> = {},
  headers?: Record<string, string>
): Promise<T> => {
  const options = {
    method,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyRequest),
  }
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, options)
  if (!response.ok) throw response.status
  return (await response.json()) as T
}
