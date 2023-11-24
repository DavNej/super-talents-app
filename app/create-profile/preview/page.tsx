'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'

import { BackLink, Button, ProfilePreview } from '@/app/components'

import type { ProfileWithHandleType } from '@/features/profile'
import { validateIPFSProfile } from '@/features/profile/schemas'
import { useProfileIdOfHandle } from '@/features/talent-layer'
import type { DataUrlType } from '@/utils/data-url'

import { MintButton } from '../components'
import { breakpoints } from '@/utils'

export default function ProfilePreviewPage() {
  const [newProfile] = useLocalStorage<ProfileWithHandleType | null>(
    'newProfile',
    null
  )
  const [selectedAvatar] = useLocalStorage<DataUrlType | null>(
    'selectedAvatar',
    null
  )

  const handle = newProfile?.handle || ''
  const { data: talentLayerId } = useProfileIdOfHandle({ handle })
  const isMediumScreen = useMediaQuery({ minWidth: breakpoints.md })

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

  function MintProfileButton() {
    return allowMint ? (
      <MintButton handle={handle} profileToUpload={profileToUpload} />
    ) : (
      <Button isDisabled>Mint my profile NFT</Button>
    )
  }

  return (
    <main className='px-6 pb-6 md:px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-cover'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <div className='mb-7 mt-3 md:mt-7 md:mb-12 flex justify-between items-center'>
          <h3 className='font-semibold text-4xl md:text-5xl whitespace-nowrap'>
            Profile preview
          </h3>
          {isMediumScreen && <MintProfileButton />}
        </div>

        {handle && profileToUpload && (
          <ProfilePreview
            handle={handle}
            profileData={profileToUpload}
            isSigner
          />
        )}
        {!isMediumScreen && <MintProfileButton />}
      </div>
    </main>
  )
}
