'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'react-toastify'

import { BackLink, Button, ProfilePreview } from '@/app/components'
import TalentLayerButton from '@/app/components/TalentLayerButton'

import type { DataUrlType } from '@/lib/avatar/types'
import type { IPFSProfileType, NewProfileType } from '@/lib/profile/types'
import { IPFSProfile } from '@/lib/profile/schemas'

export default function ProfilePreviewPage() {
  const [newProfile] = useLocalStorage<NewProfileType | null>(
    'newProfile',
    null
  )
  const [selectedAvatar] = useLocalStorage<DataUrlType | null>(
    'selectedAvatar',
    null
  )

  if (!newProfile) return redirect('/create-profile/info')
  if (!selectedAvatar) return redirect('/create-profile/avatar')

  let IPFSProfileData: IPFSProfileType

  const dataToUpload = newProfile && { ...newProfile, picture: selectedAvatar }
  const handle = newProfile?.handle
  const result = IPFSProfile.safeParse(dataToUpload)

  if (result.success) {
    IPFSProfileData = result.data
  } else {
    toast.error('Could not parse data before upload')
    console.error(result.error.issues)
    IPFSProfileData = dataToUpload as IPFSProfileType
  }

  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <div className='mb-12 flex justify-between items-center'>
          <h3 className='font-semibold text-5xl whitespace-nowrap'>
            Profile preview
          </h3>
          {handle ? (
            <TalentLayerButton handle={handle} dataToUpload={dataToUpload} />
          ) : (
            <Button isDisabled>Mint my profile NFT</Button>
          )}
        </div>

        {handle && IPFSProfileData && (
          <ProfilePreview
            handle={handle}
            profileData={IPFSProfileData}
            isSigner
          />
        )}
      </div>
    </main>
  )
}
