'use client'
import React from 'react'
import axios from 'axios'
import { urlFromCid } from '@/lib/ipfs'
import { toast } from 'react-toastify'

import ProfilePreview from '@/app/components/ProfilePreview'
import LogoutButton from '@/app/components/LogoutButton'
import { useUser } from '@/app/hooks/user'
import type { IProfile, IProfileIPFS } from '@/app/hooks/profile/types'
import PageLoader from '@/app/components/PageLoader'
import { redirect } from 'next/navigation'
import { useProfile } from '@/app/hooks/profile'

export default function ProfilePage() {
  const { id, cid, handle } = useUser()
  const { profile, setProfile } = useProfile()

  React.useEffect(() => {
    if (cid && handle) {
      axios
        .get<IProfileIPFS>(urlFromCid(cid))
        .then(res => {
          const profileData: IProfile = { ...res.data, handle }
          setProfile(profileData)
        })
        .catch(err => {
          console.error(err)
          toast.error('Could not fetch profile data')
        })
    }
  }, [cid, handle, setProfile])

  if (!id) redirect('/')
  if (!profile || !handle) return <PageLoader />

  return (
    <>
      <ProfilePreview />
      <LogoutButton />
    </>
  )
}
