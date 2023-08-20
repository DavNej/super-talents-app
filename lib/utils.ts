import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input))
}

export async function pause(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

export const inputClassNames = [
  'py-4',
  'px-8',
  'mt-2',
  'w-full',
  'rounded-[32px]',
  'font-light',
  'bg-white',
  'backdrop-blur-xl',
  'bg-opacity-20',
  'outline-none',
  'border-white',
  'border-2',
  'border-opacity-0',
  'focus:border-opacity-100',
]
