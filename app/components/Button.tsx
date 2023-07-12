'use client'

import clsx from 'clsx'

export default function Button({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick: () => unknown
}) {
  return (
    <button
      className={clsx(
        'py-5',
        'px-8',
        'w-full',
        'rounded-full',
        'uppercase',
        'font-medium',
        'text-xl',
        'bg-white',
        'text-pink',
        className
      )}
      onClick={onClick}>
      {children}
    </button>
  )
}
