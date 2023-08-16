'use client'

import LogoutButton from '@/app/components/LogoutButton'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function ProgressBarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <>
      <div className='py-12 px-24 flex flex-row gap-7'>
        <Step
          caption='Create avatar'
          isActive={
            pathname === '/profile/new/avatar' ||
            pathname === '/profile/new/info' ||
            pathname === '/profile/new/preview'
          }
        />
        <Step
          caption='Profile info'
          isActive={
            pathname === '/profile/new/info' ||
            pathname === '/profile/new/preview'
          }
        />
        <Step
          caption='Mint your profile NFT'
          isActive={pathname === '/profile/new/preview'}
        />
        <LogoutButton />
      </div>
      {children}
    </>
  )
}

function Step({ isActive, caption }: { isActive: boolean; caption: string }) {
  return isActive ? (
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
