import { TOKEN_TYPE } from '@/constants/auth'

const { ACCESS_TOKEN, REFRESH_TOKEN, USER } = TOKEN_TYPE

export const tokenStorage = {
  getAccessToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_TOKEN)
  },

  getRefreshToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_TOKEN)
  },

  setAccessToken(token: string) {
    if (typeof window === 'undefined') return
    localStorage.setItem(ACCESS_TOKEN, token)
  },

  setRefreshToken(token: string) {
    if (typeof window === 'undefined') return
    localStorage.setItem(REFRESH_TOKEN, token)
  },

  removeAccessToken() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(ACCESS_TOKEN)
  },

  removeRefreshToken() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(REFRESH_TOKEN)
  },

  setUser(user: any) {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER, JSON.stringify(user))
  },

  getUser() {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(USER)
    return user ? JSON.parse(user) : null
  },

  removeUser() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(USER)
  },

  clear() {
    this.removeAccessToken()
    this.removeRefreshToken()
    this.removeUser()
  },
}
