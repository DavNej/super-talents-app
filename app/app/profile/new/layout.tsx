'use client'

import React from 'react'
import { PageLoader } from '@/app/app/components'
import { LogoutButton } from '@/features/auth'
import { usePathname, useRouter } from 'next/navigation'
import { useSigner } from '@/lib/web3auth/hooks'

export default function ProgressBarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const signer = useSigner()
  const hasSigner = Boolean(signer.data?.signer)

  React.useEffect(() => {
    if (signer.isFetched && !hasSigner) {
      router.push('/app/login')
    }
  }, [router, hasSigner, signer.isFetched])

  return !hasSigner ? (
    <PageLoader />
  ) : (
    <>
      <div className='py-12 px-24 flex flex-row gap-7'>
        <Step
          caption='Create avatar'
          isActive={
            pathname === '/app/profile/new/avatar' ||
            pathname === '/app/profile/new/info' ||
            pathname === '/app/profile/new/preview'
          }
        />
        <Step
          caption='Profile info'
          isActive={
            pathname === '/app/profile/new/info' ||
            pathname === '/app/profile/new/preview'
          }
        />
        <Step
          caption='Mint your profile NFT'
          isActive={pathname === '/app/profile/new/preview'}
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
