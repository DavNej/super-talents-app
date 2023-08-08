'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

import BackLink from '@/app/components/BackLink'
import ProfileForm from './components/ProfileForm'
import type { IFormValues } from './form-utils'
import { useRouter } from 'next/navigation'

export default function ProfileInfoPage() {
  const [_, setProfile] = useLocalStorage<IFormValues | null>(
    'SuperTalentProfile',
    null
  )

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
