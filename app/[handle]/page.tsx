import React from 'react'

import { ProfilePreview } from '@/app/components'
import { getTalentLayerUser } from '@/lib/talent-layer/subgraph'
import { getProfileData } from '@/lib/profile/helpers'
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
