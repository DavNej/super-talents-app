import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input))
}

export async function pause(duration: number) {
  return new Promise<void>(resolve => setTimeout(resolve, duration))
}

export async function log(message?: any, ...optionalParams: any[]) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.LOG_LEVEL === 'debug'
  ) {
    console.log(message, ...optionalParams)
  }
}

export function deepEqual(obj1: any, obj2: any): boolean {
  // If both are same instance, return true
  if (obj1 === obj2) {
    return true
  }

  // If either of them is null or not an object, return false
  if (
    obj1 === null ||
    obj2 === null ||
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object'
  ) {
    return false
  }

  // Compare number of properties
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  // Check each property
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}
