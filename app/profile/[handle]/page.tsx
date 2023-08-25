'use client'

import React from 'react'

import { PageLoader, ProfilePreview } from '@/app/components'
import { useAuth } from '@/lib/web3auth/hooks'

import { useProfileData } from '@/features/profile'
import { useUser } from '@/features/profile/hooks'

export default function ProfileHandlePage({
  params,
}: {
  params: { handle: string }
}) {
  const { handle } = params

  const { provider } = useAuth()
  const signerAddress = provider?.signerAddress
  const connectedUser = useUser({ address: signerAddress })

  const isSigner = connectedUser.data?.handle === handle

  const useUserParams = isSigner ? { address: signerAddress } : { handle }
  const user = useUser(useUserParams)
  const profile = useProfileData({ cid: user.data?.cid })

  if (profile.isLoading || user.isLoading) return <PageLoader />

  if (!profile.data) {
    return (
      <main className='p-24'>
        <p>No profile to show</p>
      </main>
    )
  }

  return (
    <main className='p-24'>
      <ProfilePreview handle={handle} profileData={profile.data} />
    </main>
  )
}
