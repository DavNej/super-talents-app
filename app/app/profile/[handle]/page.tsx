'use client'

import React from 'react'

import { PageLoader } from '@/app/app/components'
import { useSigner } from '@/lib/web3auth/hooks'

import { useProfileData, ProfilePreview } from '@/features/profile'
import { useUser } from '@/features/profile/hooks'

export default function ProfileHandlePage({
  params,
}: {
  params: { handle: string }
}) {
  const { handle } = params

  const signer = useSigner()
  const signerAddress = signer.data?.address
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
