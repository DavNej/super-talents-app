'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'

import { Button, ProfilePreview, Title } from '@/app/components'

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

  if (!selectedAvatar) {
    redirect('/create-profile/avatar')
  }
  if (!newProfile) {
    redirect('/create-profile/info')
  }

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
    <>
      <div className='flex justify-between items-center mt-3 mb-6'>
        <Title className='my-0'>Profile preview</Title>
        {isMediumScreen && <MintProfileButton />}
      </div>

      {handle && profileToUpload && (
        <ProfilePreview
          handle={handle}
          profileData={profileToUpload}
          isSigner
        />
      )}

      <br className='mt-6 md:mt-0' />

      {!isMediumScreen && <MintProfileButton />}
    </>
  )
}
