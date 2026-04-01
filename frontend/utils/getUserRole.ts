export const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('role')
  }
  return null
}
