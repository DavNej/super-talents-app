'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'react-toastify'

import { BackLink, Button, ProfilePreview } from '@/app/components'
import TalentLayerButton from '@/app/components/TalentLayerButton'

import type { DataUrlType } from '@/lib/avatar/types'
import type { NewProfileType } from '@/lib/profile/types'
import { validateIPFSProfile } from '@/lib/profile/schemas'
import { useProfileIdOfHandle } from '@/lib/hooks'

export default function ProfilePreviewPage() {
  const [newProfile] = useLocalStorage<NewProfileType | null>(
    'newProfile',
    null
  )
  const [selectedAvatar] = useLocalStorage<DataUrlType | null>(
    'selectedAvatar',
    null
  )

  const handle = newProfile?.handle || ''
  const { data: talentLayerId } = useProfileIdOfHandle({ handle })

  if (talentLayerId) {
    toast.error('Handle already exists')
  }

  if (!selectedAvatar) return redirect('/create-profile/avatar')
  if (!newProfile) return redirect('/create-profile/info')

  const profileToUpload = validateIPFSProfile({
    ...newProfile,
    picture: selectedAvatar,
  })

  const allowMint = handle && profileToUpload && !talentLayerId

  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <div className='mb-12 flex justify-between items-center'>
          <h3 className='font-semibold text-5xl whitespace-nowrap'>
            Profile preview
          </h3>
          {allowMint ? (
            <TalentLayerButton
              handle={handle}
              profileToUpload={profileToUpload}
            />
          ) : (
            <Button isDisabled>Mint my profile NFT</Button>
          )}
        </div>

        {handle && profileToUpload && (
          <ProfilePreview
            handle={handle}
            profileData={profileToUpload}
            isSigner
          />
        )}
      </div>
    </main>
  )
}
