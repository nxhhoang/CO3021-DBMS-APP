import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(
  error: unknown,
  defaultMessage: string = 'An error occurred',
): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data
      // If there are specific validation errors, return the first one
      if (data?.errors) {
        const firstErrorKey = Object.keys(data.errors)[0]
        if (firstErrorKey) {
          return data.errors[firstErrorKey].msg || defaultMessage
        }
      }
      return data?.message || defaultMessage
    }
  } else if (error instanceof Error) {
    return error.message
  }
  return defaultMessage
}

export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
