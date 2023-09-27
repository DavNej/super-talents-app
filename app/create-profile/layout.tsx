'use client'
import React from 'react'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'

import { LogoutButton } from '@/app/components'
import { useAuth } from '@/features/auth'
import { useBiconomy } from '@/features/biconomy'

export default function ProgressBarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useAuth()
  const { connectedUser } = useBiconomy()

  if (status === 'ready') {
    return redirect('/login')
  }

  if (connectedUser?.data?.handle) {
    return redirect(`/${connectedUser.data.handle}`)
  }

  return (
    <>
      <div className='py-12 px-24 flex flex-row gap-7'>
        <NavStep
          caption='Create avatar'
          activeOnPages={[
            '/create-profile/avatar',
            '/create-profile/info',
            '/create-profile/preview',
          ]}
        />
        <NavStep
          caption='Profile info'
          activeOnPages={['/create-profile/info', '/create-profile/preview']}
        />
        <NavStep
          caption='Mint your profile NFT'
          activeOnPages={['/create-profile/preview']}
        />
        <LogoutButton />
      </div>

      {children}
    </>
  )
}



function NavStep({
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
