export const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        return JSON.parse(user).role
      } catch {
        return null
      }
    }
  }
  return null
}
