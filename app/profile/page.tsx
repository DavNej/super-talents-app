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
import { redirect, useRouter } from 'next/navigation'
import { useProfile } from '@/app/hooks/profile'
import { useWeb3Auth } from '../hooks/web3auth'

export default function ProfilePage() {
  const { id, cid, handle } = useUser()
  const { profile, setProfile } = useProfile()

  const { status } = useWeb3Auth()

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
  if (!(status === 'connected')) redirect('/login')
  if (!profile || !handle) return <PageLoader />

  return (
    <main className='p-24 min-h-screen flex flex-col items-center'>
      <ProfilePreview className='flex-a' />
      <LogoutButton className='mt-4' />
    </main>
  )
}
