'use client'

import { usePathname } from 'next/navigation'

export default function Step({
  activeOnPages,
  caption,
}: {
  activeOnPages: string[]
  caption: string
}) {
  const pathname = usePathname()

  return activeOnPages.includes(pathname) ? (
    <div className='flex-1'>
      <p className='font-medium text-xl text-center'>{caption}</p>
      <div className='mt-3 h-3 rounded-full bg-pink'></div>
    </div>
  ) : (
    <div className='flex-1'>
      <p className='font-medium text-xl text-center opacity-70'>{caption}</p>
      <div className='mt-3 h-3 rounded-full bg-gray-700' />
    </div>
  )
}
