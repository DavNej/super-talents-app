'use client'

import React from 'react'
import BackLink from '@/app/components/BackLink'
import ProfileForm from './components/ProfileForm'
import type { IProfileForm } from '@/app/hooks/profile/types'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/app/hooks/profile'
import { useLocalStorage } from 'usehooks-ts'

export default function ProfileInfoPage() {
  const { setProfile, profile } = useProfile()
  const { push } = useRouter()

  const [selectedAvatar] = useLocalStorage('selectedAvatar', '')

  function onSubmit(data: IProfileForm) {
    setProfile({ ...data, picture: selectedAvatar })
    push('/profile/new/preview')
  }

  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <h3 className='font-semibold text-5xl mb-12 whitespace-nowrap'>
          Add Profile Info
        </h3>
        <ProfileForm onSubmit={onSubmit} profile={profile} />
      </div>
    </main>
  )
}
