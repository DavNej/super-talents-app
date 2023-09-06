'use client'
import React from 'react'

import { LogoutButton } from '@/app/components'
import NavStep from './NavStep'
import { useAuth } from '@/lib/hooks'
import { redirect } from 'next/navigation'
import { useBiconomy } from '@/lib/hooks/useBiconomy'

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
