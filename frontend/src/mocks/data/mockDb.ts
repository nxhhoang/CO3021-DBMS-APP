import type { Address, Category, Order, Review, UserWithCredentials } from '@/types'
import { MOCK_USERS, MOCK_SESSIONS } from './users'
import { MOCK_ADDRESSES } from './addresses'
import { MOCK_CATEGORIES } from './categories'
import { MOCK_PRODUCTS } from './products'
import { MOCK_INVENTORY } from './inventory'
import { MOCK_CART } from './cart'
import { MOCK_ORDERS } from './orders'

export type MockSession = { accessToken: string; refreshToken: string; userId: string }

/**
 * In-memory mock DB (browser memory).
 * NOTE: this resets on page reload.
 */
export const mockDb = {
  users: MOCK_USERS,
  sessions: MOCK_SESSIONS as MockSession[],
  addresses: MOCK_ADDRESSES as Address[],
  categories: MOCK_CATEGORIES as Category[],
  products: MOCK_PRODUCTS,
  inventory: MOCK_INVENTORY,
  cart: MOCK_CART,
  orders: MOCK_ORDERS as Order[],
  reviewsByProduct: new Map<string, Review[]>(),
}

export function getSessionFromAuthHeader(authHeader: string | null): MockSession | null {
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  const token = parts.length === 2 ? parts[1] : null
  if (!token) return null
  return mockDb.sessions.find((s) => s.accessToken === token) ?? null
}

export function requireSession(authHeader: string | null) {
  const session = getSessionFromAuthHeader(authHeader)
  if (!session) {
    return { ok: false as const, response: { message: 'Bạn chưa đăng nhập', data: null }, status: 401 }
  }
  return { ok: true as const, session }
}

export function findUserById(userId: string): UserWithCredentials | undefined {
  return mockDb.users.find((u) => u.userId === userId)
}

export function isAdmin(userId: string): boolean {
  const u = findUserById(userId)
  return u?.role === 'ADMIN'
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`
}

