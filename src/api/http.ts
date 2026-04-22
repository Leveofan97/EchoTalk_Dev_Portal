import { useAuthStore } from '@/stores/auth'

const protocol = import.meta.env.VITE_HTTP_PROTOCOL || 'https'
const domain = import.meta.env.VITE_API_DOMAIN || 'jiechotalk.ru'
const port = import.meta.env.VITE_API_PORT || '8443'

const apiDomainUrl = `${protocol}://${domain}${port ? `:${port}` : ''}`

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
  requires2FA?: boolean
  userId?: string
  message?: string
}

export const makeApiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> => {
  const { method = 'GET', headers = {}, body = null, timeout = 15000 } = options

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const authStore = useAuthStore()
    const token = authStore.session?.token

    const finalHeaders: Record<string, string> = {
      ...(token ? { Authorization: `${token}` } : {}),
      ...headers,
    }

    if (!isFormData && body) {
      finalHeaders['Content-Type'] = 'application/json'
    }

    const response = await fetch(`${apiDomainUrl}${endpoint}`, {
      method,
      headers: finalHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : null,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const responseData = await response.json().catch(() => ({}))

    if (response.status === 204) {
      return { status: 204 }
    }

    if (responseData.requires2FA) {
      return {
        status: response.status,
        requires2FA: true,
        userId: responseData.userId,
        error: responseData.message || 'Требуется двухфакторная аутентификация',
      }
    }

    if (!response.ok) {
      const errorMsg =
        responseData?.error || responseData?.message || `HTTP error! status: ${response.status}`
      return {
        status: response.status,
        error: errorMsg,
      }
    }

    if (Array.isArray(responseData)) {
      return { data: responseData, status: response.status }
    }

    if (responseData.data !== undefined) {
      return {
        data: responseData.data as T,
        status: response.status,
      }
    }

    const keys = Object.keys(responseData)
    const numericKeys = keys.filter((k) => !isNaN(Number(k)))
    const hasStatus = keys.includes('status')

    if (numericKeys.length > 0 && hasStatus) {
      const arr = numericKeys
        .map((k) => responseData[k])
        .sort(
          (a, b) =>
            Number(keys.find((key) => responseData[key] === a)) -
            Number(keys.find((key) => responseData[key] === b)),
        )
      return { data: arr as T, status: response.status }
    }

    return { data: responseData as T, status: response.status }
  } catch (e: any) {
    clearTimeout(timeoutId)

    if (e.name === 'AbortError') {
      console.error('API request timeout:', e)
      return {
        status: 0,
        error: 'timeout',
      }
    }

    console.error('API network error:', e)
    return { status: 0, error: 'Ошибка сети. Сервер не отвечает' }
  }
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    makeApiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    makeApiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    makeApiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    makeApiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}
