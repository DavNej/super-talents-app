import React from 'react'

import { ProfilePreview } from '@/app/components'
import { getTalentLayerUser } from '@/features/talent-layer'
import { getProfileData } from '@/features/profile'

import Logout from './Logout'

export const revalidate = 0

export default async function ProfileHandlePage({
  params,
}: {
  params: { handle: string }
}) {
  const { handle } = params

  const user = await getTalentLayerUser({ handle })
  const profile = await getProfileData(user?.cid)

  return (
    <main className='p-24'>
      {profile ? (
        <ProfilePreview handle={handle} profileData={profile} />
      ) : (
        <p>No profile to show</p>
      )}

      <Logout />
    </main>
  )
}
