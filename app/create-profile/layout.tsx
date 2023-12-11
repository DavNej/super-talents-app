'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'
import {
  ConnectButton,
  useAccountInfo,
} from '@particle-network/connect-react-ui'

import { BackLink, Background, LogoutButton } from '@/app/components'
import { cn } from '@/utils'

const adminWallets = (process.env.NEXT_PUBLIC_ADMIN_WALLETS || '').split(',')

export default function ProgressBarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { account, accountLoading } = useAccountInfo()

  if (accountLoading) {
    return <ConnectButton />
  }

  if (!account) {
    redirect('/')
  }

  return (
    <>
      <div className='py-7 px-5 md:py-12 md:px-24 flex flex-row gap-2 md:gap-7'>
        <NavStep
          caption='Create avatar'
          activeOnPages={[
            '/create-profile/avatar',
            '/create-profile/claim-handle',
            '/create-profile/info',
            '/create-profile/preview',
          ]}
        />
        <NavStep
          caption='Claim handle'
          activeOnPages={[
            '/create-profile/claim-handle',
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

      <main className='px-6 md:px-24 pb-6 md:pb-12 flex flex-col flex-1'>
        <BackLink />
        <div className='flex flex-col flex-1'>{children}</div>
      </main>

      <Background />
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
  const isActive = activeOnPages.includes(pathname)

  return (
    <div className='flex-1'>
      <p
        className={cn(
          'font-medium',
          'text-xl',
          'text-center',
          'hidden',
          'md:block',
          isActive && 'opacity-70'
        )}>
        {caption}
      </p>
      <div
        className={cn(
          'mt-0',
          'md:mt-3',
          'h-1',
          'rounded-full',
          isActive ? 'bg-pink' : 'bg-gray-700'
        )}></div>
    </div>
  )
}
