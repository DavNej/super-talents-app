'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

import BackLink from '@/app/components/BackLink'

import type { IProfileData } from '../info/form-utils'
export default function ProfilePreviewPage() {
  const [profile] = useLocalStorage<IProfileData | null>(
    'SuperTalentProfile',
    null
  )

  function onSubmit(data: IProfileData) {
  }

  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <h3 className='font-semibold text-5xl mb-12 whitespace-nowrap'>
          Profile preview
        </h3>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </main>
  )
}
