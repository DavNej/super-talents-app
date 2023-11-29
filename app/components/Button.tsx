'use client'

import { cn } from '@/utils'

export default function Button({
  children,
  className,
  onClick,
  isDisabled,
  isLoading,
  type = 'button',
}: {
  children: React.ReactNode
  className?: string
  isLoading?: boolean
  isDisabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      className={cn(
        'py-3',
        'md:py-5',
        'px-8',
        'rounded-full',
        'uppercase',
        'font-medium',
        'text-base',
        'md:text-xl',
        'bg-white',
        'border-2',
        'border-white',
        'whitespace-nowrap',
        'overflow-hidden',
        'overflow-ellipsis',
        isDisabled || isLoading ? 'text-gray-400' : 'text-pink',
        className
      )}
      disabled={isDisabled || isLoading}
      onClick={onClick}>
      {isLoading ? 'Loading...' : children}
    </button>
  )
}
