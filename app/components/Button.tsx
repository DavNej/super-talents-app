'use client'

import clsx from 'clsx'

export default function Button({
  children,
  className,
  onClick,
  isDisabled,
  type = 'button',
}: {
  children: React.ReactNode
  className?: string
  isDisabled?: boolean
  onClick?: () => unknown
  type?: 'button' | 'submit' | 'reset'
}) {
  return (
    <button
      type={type}
      className={clsx(
        'py-5',
        'px-8',
        'w-full',
        'rounded-full',
        'uppercase',
        'font-medium',
        'text-xl',
        'bg-white',
        isDisabled ? 'text-gray-400' : 'text-pink',
        className
      )}
      disabled={isDisabled}
      onClick={onClick}>
      {children}
    </button>
  )
}
