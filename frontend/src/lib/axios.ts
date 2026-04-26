import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios'
import { BASE_URL } from '@/constants/api'
import { tokenStorage } from '@/services/tokenStorage'

declare global {
  interface Window {
    api: typeof api
    privateApi: typeof privateApi
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let refreshPromise: Promise<string> | null = null

privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== 'undefined' ? tokenStorage.getAccessToken() : null

    if (token) {
      config.headers = new AxiosHeaders(config.headers)
      config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.api = api
  window.privateApi = privateApi
}

privateApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | AxiosRequestConfigWithRetry
      | undefined

    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      tokenStorage.clear()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    originalRequest._retry = true
    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post('auth/refresh-token', { refreshToken })
          .then((res) => {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data
            tokenStorage.setAccessToken(newAccessToken)
            tokenStorage.setRefreshToken(newRefreshToken)
            privateApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
            return newAccessToken
          })
          .catch((err) => {
            tokenStorage.clear()
            window.location.href = '/login'
            throw err
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const newAccessToken = await refreshPromise

      originalRequest.headers = new AxiosHeaders(originalRequest.headers)
      originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)

      return privateApi(originalRequest)
    } catch (refreshError) {
      tokenStorage.clear()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    }
  },
)
