'use client'

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { PageLoader } from '@/app/app/components'

import { TSigner } from '@/lib/web3auth/hooks'

import type {
  IFetchTalentLayerUserParams,
  TalentLayerUserType,
} from '@/lib/talent-layer/types'

import { useProfileData, ProfilePreview } from '@/features/profile'
import { useUser } from '@/features/profile/hooks'

export default function ProfileHandlePage({
  params,
}: {
  params: { handle: string }
}) {
  const { handle } = params

  const queryClient = useQueryClient()
  const signer = queryClient.getQueryData<TSigner>(['signer', 'connected'])
  const signerAddress = signer?.address
  const connectedUser = queryClient.getQueryData<TalentLayerUserType>([
    'user',
    { address: signerAddress },
  ])
  const isSigner = connectedUser?.handle === handle
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
      <ProfilePreview
        handle={handle}
        profileData={profile.data}
        isSigner={isSigner}
      />
    </main>
  )
}
