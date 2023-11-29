import { cn } from '@/utils'

export default function Background({
  image = 'bg-common',
}: {
  image?: 'bg-common' | 'bg-sign-up'
}) {
  return (
    <div className='fixed inset-0 -z-50 bg-gray-900 h-screen w-screen'>
      <div
        className={cn(
          'absolute',
          'bottom-0',
          'w-screen',
          'h-[60vh]',
          'md:h-screen',
          'bg-no-repeat',
          'bg-cover',
          'bg-right',
          image
        )}
      />
    </div>
  )
}
