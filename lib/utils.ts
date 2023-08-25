import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input))
}

export async function pause(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

export async function log(message?: any, ...optionalParams: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, ...optionalParams)
  }
}
