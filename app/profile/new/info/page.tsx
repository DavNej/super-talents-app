'use client'

import React from 'react'
import BackLink from '@/app/components/BackLink'
import ProfileForm from './components/ProfileForm'
import type { IFormValues } from '@/app/hooks/profile/types'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/app/hooks/profile'

export default function ProfileInfoPage() {
  const { setProfile } = useProfile()
  const { push } = useRouter()

  function onSubmit(data: IFormValues) {
    setProfile(data)
    push('/profile/new/preview')
  }

  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <h3 className='font-semibold text-5xl mb-12 whitespace-nowrap'>
          Add Profile Info
        </h3>
        <ProfileForm onSubmit={onSubmit} />
      </div>
    </main>
  )
}
