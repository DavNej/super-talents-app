'use client'

import React from 'react'

import { PageLoader } from '@/app/app/components'

import { useSigner } from '@/lib/web3auth/hooks'
import { useTalentLayerUser } from '@/lib/talent-layer/subgraph/hooks'

import { useProfile, ProfilePreview } from '@/features/profile'

export default function ProfileHandlePage({
  params,
}: {
  params: { handle: string }
}) {
  const { handle } = params
  const signer = useSigner()
  const address = signer.data?.address

  const profile = useProfile({ handle })
  const connectedUser = useTalentLayerUser({ address })

  const isSigner = connectedUser.data?.handle === handle

  if (!profile.isFetched || connectedUser.isLoading) return <PageLoader />

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
