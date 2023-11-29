import { cn } from '@/utils'

export default function Title({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <h3
      className={cn(
        'font-semibold',
        'text-4xl',
        'md:text-5xl',
        'my-6',
        'md:whitespace-nowrap',
        className
      )}>
      {children}
    </h3>
  )
}
