'use client'

import React from 'react'

import { LogoutButton, PageLoader, ProfilePreview } from '@/app/components'
import { useAuth, useProfileData, useTalentLayerUser } from '@/lib/hooks'

export default function ProfileHandlePage({
  params,
}: {
  params: { handle: string }
}) {
  const { handle } = params

  const { provider } = useAuth()
  const user = useTalentLayerUser({ handle })
  const profile = useProfileData({ cid: user.data?.cid })

  if (profile.isFetching || user.isFetching) return <PageLoader />

  return (
    <main className='p-24'>
      {profile.data ? (
        <ProfilePreview handle={handle} profileData={profile.data} />
      ) : (
        <p>No profile to show</p>
      )}
      {provider && (
        <div className='flex justify-center mt-8'>
          <LogoutButton />
        </div>
      )}
    </main>
  )
}
