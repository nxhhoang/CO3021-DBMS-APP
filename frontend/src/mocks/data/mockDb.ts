import type { Address, Category, Order, Review, UserWithCredentials } from '@/types'
import { MOCK_USERS, MOCK_SESSIONS } from './users'
import { MOCK_ADDRESSES } from './addresses'
import { MOCK_CATEGORIES } from './categories'
import { MOCK_PRODUCTS } from './products'
import { MOCK_INVENTORY } from './inventory'
import { MOCK_CART } from './cart'
import { MOCK_ORDERS } from './orders'

export type MockSession = { accessToken: string; refreshToken: string; userId: string }

const PERSISTED_KEYS = ['users', 'sessions', 'addresses', 'cart', 'orders']
const LS_PREFIX = 'msw_db_'

const isBrowser = typeof window !== 'undefined'

const loadFromLocalStorage = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback
  try {
    const saved = localStorage.getItem(LS_PREFIX + key)
    return saved ? JSON.parse(saved) : fallback
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return fallback
  }
}

const saveToLocalStorage = (key: string, data: any) => {
  if (!isBrowser) return
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

/**
 * In-memory mock DB (browser memory) with localStorage persistence.
 */
const rawDb = {
  users: loadFromLocalStorage('users', MOCK_USERS),
  sessions: loadFromLocalStorage('sessions', MOCK_SESSIONS) as MockSession[],
  addresses: loadFromLocalStorage('addresses', MOCK_ADDRESSES) as Address[],
  categories: MOCK_CATEGORIES as Category[],
  products: MOCK_PRODUCTS,
  inventory: MOCK_INVENTORY,
  cart: loadFromLocalStorage('cart', MOCK_CART),
  orders: loadFromLocalStorage('orders', MOCK_ORDERS) as Order[],
  reviewsByProduct: new Map<string, Review[]>(),
}

// Recursive Proxy to automatically save changes to localStorage
const createPersistentProxy = (data: any, onWrite: () => void): any => {
  if (data && typeof data === 'object' && !(data instanceof Map)) {
    return new Proxy(data, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver)
        if (typeof value === 'function') {
          const mutatingMethods = [
            'push',
            'pop',
            'shift',
            'unshift',
            'splice',
            'sort',
            'reverse',
          ]
          if (mutatingMethods.includes(prop as string)) {
            return (...args: any[]) => {
              const result = value.apply(target, args)
              onWrite()
              return result
            }
          }
        }
        return createPersistentProxy(value, onWrite)
      },
      set(target, prop, value, receiver) {
        const success = Reflect.set(target, prop, value, receiver)
        if (success) {
          onWrite()
        }
        return success
      },
      deleteProperty(target, prop) {
        const success = Reflect.deleteProperty(target, prop)
        if (success) {
          onWrite()
        }
        return success
      },
    })
  }
  return data
}

export const mockDb = new Proxy(rawDb, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)

    if (PERSISTED_KEYS.includes(prop as string)) {
      return createPersistentProxy(value, () =>
        saveToLocalStorage(prop as string, target[prop as keyof typeof target]),
      )
    }

    return value
  },
  set(target, prop, value, receiver) {
    const success = Reflect.set(target, prop, value, receiver)
    if (success && PERSISTED_KEYS.includes(prop as string)) {
      saveToLocalStorage(prop as string, value)
    }
    return success
  },
})

export function getSessionFromAuthHeader(
  authHeader: string | null,
): MockSession | null {
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  const token = parts.length === 2 ? parts[1] : null
  if (!token) return null
  return mockDb.sessions.find((s) => s.accessToken === token) ?? null
}

export function requireSession(authHeader: string | null) {
  const session = getSessionFromAuthHeader(authHeader)
  if (!session) {
    return {
      ok: false as const,
      response: { message: 'Bạn chưa đăng nhập', data: null },
      status: 401,
    }
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

