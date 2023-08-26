'use client'

import React from 'react'

import { PageLoader, ProfilePreview } from '@/app/components'
import { useProfileData, useTalentLayerUser } from '@/lib/hooks'

export default function ProfileHandlePage({
  params,
}: {
  params: { handle: string }
}) {
  const { handle } = params

  const user = useTalentLayerUser({ handle })
  const profile = useProfileData({ cid: user.data?.cid })

  if (profile.isFetching || user.isFetching) return <PageLoader />

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
