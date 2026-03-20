import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown, defaultMessage : string = 'An error occurred'): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return error.response.data?.message || defaultMessage;
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}
