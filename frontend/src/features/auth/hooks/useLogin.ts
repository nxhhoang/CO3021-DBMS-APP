'use client'

import { authService } from '../services/auth.service'
import { LoginRequest } from '@/types'
import { tokenStorage } from '@/services/tokenStorage'
import { useAuthContext } from '../context/AuthProvider'
import { getErrorMessage } from '@/lib/utils'

export const useLogin = () => {
  const { setUser } = useAuthContext()

  const login = async (data: Omit<LoginRequest, 'userAgent'>) => {
    try {
      const result = await authService.login({
        ...data,
        userAgent: navigator.userAgent,
      })

      if (result === null) {
        throw new Error('Login failed')
      }
      const { accessToken, refreshToken } = result

      setUser(result.user)

      tokenStorage.setAccessToken(accessToken)
      tokenStorage.setRefreshToken(refreshToken)
      tokenStorage.setUser(result.user)
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Invalid email or password'))
    }
  }

  return {
    login,
  }
}
