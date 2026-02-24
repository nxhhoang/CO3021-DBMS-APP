import type { Address } from './address.type'

type Role = 'Customer' | 'Admin'

export interface User {
  _id: string
  email: string
  fullName?: string
  avatar?: string
  address?: Address[]
  phoneNum?: string
  createdAt: string
  role: Role
}
