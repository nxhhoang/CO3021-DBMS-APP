export const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    if (user) {
      return JSON.parse(user).role
    }
  }
  return null
}
