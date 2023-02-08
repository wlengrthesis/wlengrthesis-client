type HttpMethod = 'GET' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const makeRequest = async <T>(
  endpoint: string,
  options: {
    method: HttpMethod
    headers?: Record<string, string>
    body?: Record<string, any>
  } = { method: 'GET' }
): Promise<T> => {
  const defaultOptions = {
    method: options.method,
    headers: { ...options.headers, 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  }
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, defaultOptions)
  if (!response.ok) throw response.status
  return (await response.json()) as T
}
