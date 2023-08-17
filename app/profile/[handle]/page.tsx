'use client'

import React from 'react'

import ProfilePreview from '@/app/components/ProfilePreview'
import LogoutButton from '@/app/components/LogoutButton'
import { useUser } from '@/app/hooks/user'
import { useProfile } from '@/app/hooks/profile'
import PageLoader from '@/app/components/PageLoader'
import { getUserData } from '@/lib/ipfs'

export default function ProfileHandlePage({
  params,
}: {
  params: { handle: string }
}) {
  const { user, connectedUser, getUser } = useUser()
  const { profile, setProfile } = useProfile()

  const isConnectedUser = params.handle === connectedUser?.handle

  React.useEffect(() => {
    getUser({ handle: params.handle })
  }, [getUser, isConnectedUser, params.handle])

  React.useEffect(() => {
    if (user?.cid) {
      getUserData({
        cid: user.cid,
        handle: user.handle,
      }).then(setProfile)
    }
  }, [user, connectedUser, isConnectedUser, setProfile])

  if (!profile) return <PageLoader />

  return (
    <main className='p-24 min-h-screen flex flex-col items-center'>
      <ProfilePreview
        className='flex-a'
        profile={profile}
        isMinted={Boolean(connectedUser?.id)}
      />
      <LogoutButton className='mt-4' />
    </main>
  )
}
